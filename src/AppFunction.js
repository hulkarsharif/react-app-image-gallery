import { useState, useEffect } from "react";
import { ImageApi } from "./api";
import "./App.css";

const convertToSmallerVersion = (url) => {
    let countSlash = 0;
    let sliceSlashIdx = null;
    for (let i = url.length - 1; i >= 0; i--) {
        const char = url[i];
        if (char === "/") {
            countSlash++;
            sliceSlashIdx = i;
            if (countSlash === 2) {
                break;
            }
        }
    }
    console.log(sliceSlashIdx);
    console.log(url);

    const finalUrl = `${url.slice(0, sliceSlashIdx)}/300/200`;
    console.log(finalUrl);
    return finalUrl;
};

const AppFunction = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [zoomedInImage, setZoomedInImage] = useState({});
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        setLoading(true);
        try {
            const fetchImages = async () => {
                const result = await ImageApi.fetchImages(page);
                setImages((prevImages) => [...prevImages, ...result]);
                setLoading(false);
            };
            fetchImages();
        } catch (error) {}
    }, [page]);

    // const fetchImages = async () => {
    //     try {
    //         const result = await ImageApi.fetchImages(page);
    //         setLoading(false);
    //         setImages((prevImages) => [...prevImages, ...result]);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const loadMore = async () => {
        setPage((prevPage) => prevPage + 1);
    };

    const zoomInImage = (image) => {
        setShowImage(true);
        setZoomedInImage(image);
    };

    const hideImage = () => {
        setShowImage(false);
        setZoomedInImage({});
    };

    return (
        <main>
            <h1>Unsplash Like App</h1>
            <section>
                <div className="gallery">
                    {images.map((image) => {
                        return (
                            <figure key={image.id}>
                                <img
                                    src={convertToSmallerVersion(
                                        image.download_url
                                    )}
                                    alt={image.author}
                                    onClick={() => zoomInImage(image)}
                                />
                            </figure>
                        );
                    })}
                </div>
                {images.length >= 1 ? (
                    <div>
                        <button
                            className="load-more"
                            onClick={loadMore}
                            disabled={loading}
                        >
                            Load More
                        </button>
                    </div>
                ) : null}
            </section>
            {showImage && (
                <div className="overlay">
                    <span className="overlay__close-icon" onClick={hideImage}>
                        &#10005;
                    </span>
                    <img
                        className="zoomed-in-image"
                        src={zoomedInImage.download_url}
                        alt={zoomedInImage.author}
                    />
                </div>
            )}
        </main>
    );
};

export default AppFunction;
