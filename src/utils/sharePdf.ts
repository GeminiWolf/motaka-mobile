import Share from 'react-native-share';

function isShareCancelled(error: unknown): boolean {
  if (error == null) {
    return false;
  }
  if (typeof error === 'string') {
    return /user did not share|cancel/i.test(error);
  }
  if (typeof error === 'object' && 'message' in error) {
    return /user did not share|cancel/i.test(String(error.message));
  }
  return false;
}

export async function sharePdfFile(
  path: string,
  filename: string,
): Promise<void> {
  const url = path.startsWith('file://') ? path : `file://${path}`;
  try {
    await Share.open({
      title: filename,
      url,
      type: 'application/pdf',
      filename,
      failOnCancel: false,
    });
  } catch (error) {
    if (isShareCancelled(error)) {
      return;
    }
    throw error;
  }
}
