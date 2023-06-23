import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const DisplayDetails = function (responce) {
    return (
        <ul className="officerInfo">
            {Object.keys(responce.data).map((hit) => {
                const subdata = responce.data[hit];
                const d = subdata.document;
                return (
                    <li key={d.id + '-li'}>
                        {d.bq_establishment_address1_line_1 && `${d.bq_establishment_address1_line_1}`}<br />
                        {d.bq_establishment_address1_city && `${d.bq_establishment_address1_city},`}{" "}
                        {d.bq_establishment_address1_state && `${d.bq_establishment_address1_state},`}{" "}
                        {d.bq_establishment_address1_zip5 && `${d.bq_establishment_address1_zip5}`}<br />
                        {d.bq_establishment_address1_type && `Address Type: ${d.bq_establishment_address1_type}`}
                    </li>
                );
            })}
        </ul>
    );
};

const displayOfficer = function (posts) {
    return <DisplayDetails data={posts} />;
};

const EstablishmentsView = function (props) {
    const url =
        "https://wd3vh9rpkoy6me80p-1.a1.typesense.net/collections/bq_establishment/documents/search";
    const [posts, setPosts] = useState([]);
    const [fetched, setFetched] = useState(false);

    const setDisplay = useCallback((id) => {
        if (!fetched) {
            setTimeout(() => {
                axios
                    .get(url, {
                        params: {
                            query_by: "bq_legal_entity_id",
                            q: id,
                            per_page: 20,
                            drop_tokens_threshold: 0,
                            typo_tokens_threshold: 0
                        },
                        headers: { "X-TYPESENSE-API-KEY": "tXeuzkvrjreTKuUrh4nD5FIrJEsfTck8" }
                    })
                    .then(function (response) {
                        if (response.status === 200) {
                            let data = response.data.hits;
                            setPosts(data);
                            setFetched(true);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }, 1000);
        }
    }, [url, fetched]);

    useEffect(() => {
        setDisplay(props.data);
    }, [props.data, setDisplay]);

    return (
        <>
            {posts.length > 0 ? (
                displayOfficer(posts)
            ) : (
                fetched ? (
                    <p>No Officers Listed</p>
                ) : (
                    <button className="btnNew" onClick={() => setDisplay(props.data)}>Load Establishments</button>
                )
            )}
        </>
    );
};

export default EstablishmentsView;
