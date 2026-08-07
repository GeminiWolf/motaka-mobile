#!/usr/bin/env node
/**
 * Bump / sync Garage Forge versions across package.json, Android, and iOS.
 *
 * Usage:
 *   node scripts/bump-version.js patch
 *   node scripts/bump-version.js minor
 *   node scripts/bump-version.js major
 *   node scripts/bump-version.js set 1.2.3
 *   node scripts/bump-version.js build
 *   node scripts/bump-version.js sync
 */

const fs = require('fs');
const path = require('path');
const {
  bumpSemver,
  parseSemver,
  applyAndroidVersion,
  applyIosVersion,
  readAndroidVersion,
  readIosVersion,
} = require('./versionUtils');

const ROOT = path.resolve(__dirname, '..');
const PACKAGE_JSON = path.join(ROOT, 'package.json');
const ANDROID_GRADLE = path.join(ROOT, 'android/app/build.gradle');
const IOS_PBXPROJ = path.join(
  ROOT,
  'ios/garageforge.xcodeproj/project.pbxproj',
);

function usage(exitCode = 1) {
  console.log(`Usage:
  yarn version:patch          Bump patch (0.0.1 -> 0.0.2), sync native, +build
  yarn version:minor          Bump minor (0.0.1 -> 0.1.0), sync native, +build
  yarn version:major          Bump major (0.0.1 -> 1.0.0), sync native, +build
  yarn version:set 1.2.3      Set exact version, sync native, +build
  yarn version:build          Increment build numbers only
  yarn version:sync           Sync package.json version to Android/iOS (no bump)
`);
  process.exit(exitCode);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function resolveTargetVersion(command, args, currentVersion) {
  if (command === 'patch' || command === 'minor' || command === 'major') {
    return bumpSemver(currentVersion, command);
  }

  if (command === 'set') {
    const next = args[0];
    if (!next || !parseSemver(next)) {
      throw new Error('version:set requires a semver like 1.2.3');
    }
    return next;
  }

  if (command === 'sync' || command === 'build') {
    if (!parseSemver(currentVersion)) {
      throw new Error(`Invalid package.json version: ${currentVersion}`);
    }
    return currentVersion;
  }

  throw new Error(`Unknown command: ${command}`);
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === '-h' || command === '--help') {
    usage(command ? 0 : 1);
  }

  const pkg = readJson(PACKAGE_JSON);
  const androidGradle = fs.readFileSync(ANDROID_GRADLE, 'utf8');
  const iosPbxproj = fs.readFileSync(IOS_PBXPROJ, 'utf8');

  const android = readAndroidVersion(androidGradle);
  const ios = readIosVersion(iosPbxproj);

  const versionName = resolveTargetVersion(command, args, pkg.version);
  const currentBuild = Math.max(
    android.versionCode ?? 0,
    ios.currentProjectVersion ?? 0,
    0,
  );
  const syncedBuild =
    command === 'sync' ? Math.max(currentBuild, 1) : currentBuild + 1;

  pkg.version = versionName;
  writeJson(PACKAGE_JSON, pkg);

  fs.writeFileSync(
    ANDROID_GRADLE,
    applyAndroidVersion(androidGradle, versionName, syncedBuild),
  );
  fs.writeFileSync(
    IOS_PBXPROJ,
    applyIosVersion(iosPbxproj, versionName, syncedBuild),
  );

  console.log(
    `Version ${versionName} (build ${syncedBuild}) synced to package.json, Android, and iOS.`,
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
