import React, { useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import pdf from './sample.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Pages = React.forwardRef(({ number, children }, ref) => (
    <div className="demoPage bg-white" ref={ref}>
        {children}
        <p className="text-center">Page number: {number}</p>
    </div>
));

Pages.displayName = 'Pages';

function Flipbook() {
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className='h-screen w-screen flex flex-col gap-5 justify-center items-center bg-gray-900 overflow-hidden'>
            <h1 className='text-3xl text-white text-center font-bold'>FlipBook</h1>

            {/* Load the PDF once to get the number of pages */}
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess} className="hidden">
                <Page pageNumber={1} />
            </Document>

            {numPages && (
                <HTMLFlipBook width={400} height={570}>
                    {Array.from({ length: numPages }, (_, index) => (
                        <Pages key={index} number={index + 1}>
                            <Document file={pdf}>
                                <Page
                                    pageNumber={index + 1}
                                    width={400}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                />
                            </Document>
                        </Pages>
                    ))}
                </HTMLFlipBook>
            )}
        </div>
    );
}

export default Flipbook;
