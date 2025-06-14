"use client";
import { Button } from "@heroui/react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

interface PDFViewerProps {
	file: string;
	width?: number;
}

export default function PDFViewer({ file, width = 800 }: PDFViewerProps) {
	const [numPages, setNumPages] = useState<number | null>(null);
	const [pageNumber, setPageNumber] = useState(1);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages);
		setPageNumber(1);
	}

	return (
		<div className="w-full flex flex-col items-start gap-6">
			{numPages && numPages > 1 && (
				<div className="flex gap-6 items-center">
					<Button
						type="button"
						size="sm"
						disabled={pageNumber <= 1}
						onPress={() => setPageNumber(pageNumber - 1)}
					>
						Previous
					</Button>
					<span className="text-foreground-500">
						Page {pageNumber} of {numPages}
					</span>
					<Button
						type="button"
						size="sm"
						disabled={pageNumber >= numPages}
						onPress={() => setPageNumber(pageNumber + 1)}
					>
						Next
					</Button>
				</div>
			)}
			<Document
				file={file}
				onLoadSuccess={onDocumentLoadSuccess}
				className="w-full flex flex-col items-start"
			>
				<Page
					pageNumber={pageNumber}
					width={width}
					className="border bg-background rounded shadow"
				/>
			</Document>
		</div>
	);
}
