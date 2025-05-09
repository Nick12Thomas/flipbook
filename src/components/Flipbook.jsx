import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [size, setSize] = useState({ width: 800, height: 1140 });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobileView = width < 768;

      setIsMobile(isMobileView);

      // Base width depending on screen type
      let bookWidth = isMobileView ? width * 0.95 : width * 0.8;
      let bookHeight = bookWidth * 1.414;

      if (bookHeight > height * 0.9) {
        bookHeight = height * 0.9;
        bookWidth = bookHeight / 1.414;
      }

      setSize({ width: bookWidth, height: bookHeight });
    };

    handleResize(); // call initially
    window.addEventListener('resize', handleResize); // listen for resizes

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center bg-gray-900 overflow-hidden'>
      {/* Preload once */}
      <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess} className="hidden">
        <Page pageNumber={1} />
      </Document>

      {numPages && (
        <HTMLFlipBook
          width={size.width}
          height={size.height}
          size="stretch"
          minWidth={315}
          maxWidth={1200}
          minHeight={400}
          maxHeight={1600}
          showCover={false}
          mobileScrollSupport={true}
          pageOrientation={isMobile ? 'portrait' : 'landscape'}
          className="shadow-2xl"
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Pages key={index} number={index + 1}>
              <Document file={pdf}>
                <Page
                  pageNumber={index + 1}
                  width={size.width}
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