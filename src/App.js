import React, { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";
import SimpleModal from "./components/SimpleModal/SimpleModal";
import { ZoomOutIcon, ZoomInIcon, CloseIcon } from "./components/Svgs";
import "./style.css";
import classes from "./Home.module.css";
import AvatarEditor from "react-avatar-editor";
const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [showLogoPopup, setShowLogoPopup] = useState(false);
  const [imageScale, setImageScale] = useState(0.8);
  const [imagePopupPreview, setImagePopupPreview] = useState();
  const [imagePreview, setImagePreview] = useState();
  const editorRef = useRef();
  const handleSubmit = () => {
    setIsLoading(true);
    Tesseract.recognize(URL.createObjectURL(image), "eng", {
      logger: (m) => {
        console.log(m);
        if (m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        console.log(result);
        setText(result.data.text);
        setIsLoading(false);
      });
  };
  /* logo Handler */
  const newLogoHandler = (e) => {
    var idxDot = e.target.value.lastIndexOf(".") + 1;
    var extFile = e.target.value.substr(idxDot, e.target.value.length).toLowerCase();

    if (/(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i.test(extFile)) {
      setShowLogoPopup(true);
      setImagePopupPreview(e.target.files[0]);
    } else {
      alert("Only images are allowed!");
    }
  };

  const logoApplyHandler = async () => {
    const dataUrl = editorRef.current.getImageScaledToCanvas().toDataURL();
    const result = await fetch(dataUrl);
    const blob = await result.blob();
    setImage(blob);
    const objectUrl = URL.createObjectURL(blob);
    setImagePreview(objectUrl);
    setShowLogoPopup(false);
  };

  useEffect(() => {
    if (!image) {
      /* setimagePreview(undefined); */
      return;
    }
    if (image === "empty") {
      return;
    }
    const objectUrl = URL.createObjectURL(image);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  return (
    <>
      <div className="container" style={{ height: "100vh" }}>
        <div className="row ">
          <div className="col-md-10 mx-auto h-100 d-flex flex-column ">
            <h1 className="text-center py-5 mc-5">
              BURDUR MEHMET AKİF ERSOY ÜNİVESİTESİ
              <br /> MÜHENDİSLİK-MİMARLIK FAKÜLTESİ
              <br /> BİLGİSAYAR MÜHENDİSLİĞİ
              <br /> Yapay Zeka Dersi
            </h1>
            <p>Majed Aldın Alkoutaını 1911404092</p>
            <p>Ahmad Alassı 1911404095</p>
            {isLoading && (
              <>
                <progress className="form-control" value={progress} max="100">
                  {progress}%{" "}
                </progress>{" "}
                <p className="text-center py-0 my-0">Converting:- {progress} %</p>
              </>
            )}
            {!isLoading && (
              <>
                <input type="file" onChange={(e) => newLogoHandler(e)} className="form-control mt-5 mb-2" />
                <input type="button" onClick={handleSubmit} className="btn btn-primary mt-5" value="Convert" />
              </>
            )}
            {image && <img width={200} height={200} src={imagePreview} />}
            {!isLoading && text && (
              <>
                <textarea className="form-control w-100 mt-5" rows="30" value={text} onChange={(e) => setText(e.target.value)}></textarea>
              </>
            )}
          </div>
        </div>
      </div>
      {/* changing Logo popup modal */}
      <SimpleModal closeModalHandler={() => setShowLogoPopup(false)} active={showLogoPopup}>
        <div className={classes["logo-popup"]}>
          <div className={classes.main}>
            <div className={classes.header}>
              <span>edit shop logo</span>
              <CloseIcon onClick={() => setShowLogoPopup(false)} />
            </div>
            <div className={classes.editor}>
              <AvatarEditor
                ref={editorRef}
                image={imagePopupPreview}
                border={10}
                scale={parseFloat(imageScale)}
                borderRadius={0}
                color={[6, 17, 67, 0.6]}
                /* width={232} */
          /*       height={90} */
              />
            </div>
            <div className={classes["range-slider"]}>
              <ZoomOutIcon />
              <input
                name="scale"
                type="range"
                style={{
                  background: `linear-gradient(to right, #1CA3FF 0%, #1CA3FF ${((imageScale - 0.8) / (2 - 0.8)) * 100}%, #E0F1FF  ${
                    ((imageScale - 0.8) / (2 - 0)) * 100
                  }%, #E0F1FF 100%)`,
                }}
                onChange={(e) => setImageScale(e.target.value)}
                value={imageScale}
                min="0.8"
                max="10"
                step={0.05}
              />
              <ZoomInIcon />
            </div>
            <button onClick={logoApplyHandler}>Upload</button>
          </div>
        </div>
      </SimpleModal>
    </>
  );
};

export default App;
