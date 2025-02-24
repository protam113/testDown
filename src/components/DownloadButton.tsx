// components/DownloadButton.tsx
import React, { useState } from "react";

const DownloadButton: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setError(null); // Reset error state

    try {
      const response = await fetch(
        "https://hcm03.vstorage.vngcloud.vn/v1/AUTH_e2739f2170d44cfc8cfebf9aa23752b6/download/models/ThucHanhTuan1.rar",
        {
          method: "GET",
          headers: {
            "X-Auth-Token":
              "gAAAAABnvBSrsgezz4zXxZxbSbShyM1MXsLH5QXk2chDbPOBO3ii-O0j5qsm2HF0XfjYlXbqe9sTkxhEs8Jss8IyYun0LP7_3bmLtf9R-woSoXxFcldXjEvMyHka_RPpCL9-pKqrHxVDgRrBlZO7N2u4mQ86WR-fu541AuFRiFCn0qg20kWi1qA",
          },
        }
      );

      if (!response.ok) {
        const errorMessage = `Lỗi: ${response.status} - ${response.statusText}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ThucHanhTuan1.rar";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Lỗi tải file:", error);
      setError(`Lỗi tải file: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tải File
      </button>
      {error && (
        <div className="mt-2 p-2 border border-red-500 bg-red-100 text-red-500">
          {error}
        </div>
      )}
      <style jsx>{`
        div {
          margin: 0 auto;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default DownloadButton;
