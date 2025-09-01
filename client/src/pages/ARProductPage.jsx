import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Add <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
// to your public/index.html

const ARProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // For demo, use the static file in public folder
  // const modelUrl = "../../public/nike_journey_run.glb";
  const modelUrl = "/nike_journey_run.glb"; // Use public folder path

  /*   useEffect(() => {
    // Fetch product details including modelUrl
    fetch(`http://localhost:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product)
    return <p className="text-center mt-10 text-white">Loading AR model...</p>;
  if (!product.modelUrl)
    return (
      <p className="text-center mt-10 text-red-500">
        No AR model available for this product.
      </p>
    ); */

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-white text-2xl mb-4">View Product in AR</h1>
      <model-viewer
        src={modelUrl}
        ar
        ar-modes="scene-viewer quick-look webxr"
        camera-controls
        auto-rotate
        // min-camera-orbit="auto auto 2m"
        // max-camera-orbit="auto auto 10m"
        style={{
          width: "100%",
          height: "500px",
          background: "white",
          borderRadius: "16px",
        }}
        ios-src={modelUrl}
        alt="Nike Journey Run AR Model"
      ></model-viewer>
      <p className="text-white mt-4">
        Move your phone to place the product in your room!
      </p>
    </div>
  );
};

export default ARProductPage;

{
  /* <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-white text-2xl mb-4">{product.name} - AR View</h1>
      <model-viewer
        src={product.modelUrl}
        ar
        ar-modes="scene-viewer quick-look webxr"
        camera-controls
        auto-rotate
        style={{
          width: "100%",
          height: "500px",
          background: "white",
          borderRadius: "16px",
        }}
        ios-src={product.modelUrl}
        alt={product.name}
      ></model-viewer>
      <p className="text-white mt-4">
        Move your phone to place the product in your room!
      </p>
    </div> */
}
