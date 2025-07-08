export async function uploadFileToS3(
	presignedUrl: string,
	file: File,
): Promise<void> {
	try {
		const response = await fetch(presignedUrl, {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": file.type,
			},
		});

		if (!response.ok) {
			console.error("Failed to upload file to S3:", response);
			throw new Error("Failed to upload file to S3");
		}
	} catch (error) {
		console.error("Error uploading file to S3:", error);
		throw error;
	}
}
