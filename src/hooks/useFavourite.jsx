import {useState, useEffect} from "react";

export const useFavourite = () => {
    const [favourite, setFavourite] = useState(() => {
        const saved = localStorage.getItem("favourite");
        return saved ? new Set(JSON.parse(saved)) : new Set();
      });

    useEffect(() => {
        localStorage.setItem("favourite", JSON.stringify(Array.from(favourite)));
    }, [favourite]);

    return [favourite, setFavourite];
}