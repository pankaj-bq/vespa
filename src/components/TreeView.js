import React, { useState, useEffect, useMemo } from "react";
import ErrorBoundary from "./ErrorBoundary";
import axios from "axios";
import { NumericFormat } from 'react-number-format';

const listToTree = function (data, options = {}) {
    const { idKey = "id", parentKey = "parent", childrenKey = "children" } = options;
    const processedIds = new Set();
    const rootNode = { [childrenKey]: [] };
    for (const item of data) {
        if (item[idKey]) {
            processedIds.add(item[idKey]);
            Object.assign(item, { [childrenKey]: [] });
        }
    }
    for (const item of data) {
        if (item[parentKey] && processedIds.has(item[parentKey])) {
            const parent = data.find((i) => i[idKey] === item[parentKey]);
            parent[childrenKey].push(item);
        } else {
            rootNode[childrenKey].push(item);
        }
    }
    return rootNode[childrenKey];
};

const formatData = (array) => {
    const dataMap = [];
    for (var i = 0; i < array.length; i++) {
        var obj = array[i].document;
        dataMap.push(obj);
    }
    const tree = listToTree(dataMap, {
        idKey: "bq_legal_entity_id",
        parentKey: "bq_legal_entity_parent_id",
        childrenKey: "children",
    });
    return tree;
};

const viewBox = (data, hiview) => {
    const address = data.bq_legal_entity_address1_line_1 === "" ? "" : data.bq_legal_entity_address1_line_1;
    const city = data.bq_legal_entity_address1_city === "" ? "" : data.bq_legal_entity_address1_city;
    const ultimate = data.bq_legal_entity_ultimate_parent_id === "" ? "" : data.bq_legal_entity_ultimate_parent_id;
    const state = data.bq_legal_entity_address1_state === "" ? "" : data.bq_legal_entity_address1_state;
    const status = data.bq_legal_entity_current_status === "" ? "" : data.bq_legal_entity_current_status;
    const founded = data.bq_legal_entity_date_founded === "" ? "" : data.bq_legal_entity_date_founded;
    const juri = data.bq_legal_entity_jurisdiction_code === "" ? "" : data.bq_legal_entity_jurisdiction_code;
    const bqid = data.bq_legal_entity_id === "" ? "bqid" : data.bq_legal_entity_id;
    const parent1 = data.bq_legal_entity_parent_id === "" ? "" : data.bq_legal_entity_parent_id;
    const active = data.bq_legal_entity_isactive === "" ? "Inactive" : "Active";

    return (
        <div className="viewBox">
            <h2 className="indent1">{data.bq_legal_entity_name} ({data.bq_legal_entity_parent_status})</h2>
            <div className="viewBoxRow">
                <div className="viewBoxCol">
                    <h3>Business Identity</h3>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th><strong>Entity ID</strong></th>
                                <td>{data.bq_legal_entity_id}</td>
                            </tr>
                            <tr>
                                <th><strong>BQ Employer ID</strong></th>
                                <td>{data.employer_id}</td>
                            </tr>
                            <tr>
                                <th><strong>EIN</strong></th>
                                <td>{data.bq_company_ein}</td>
                            </tr>
                            <tr>
                                <th><strong>Website</strong></th>
                                <td>{data.bq_website}</td>
                            </tr>
                            <tr>
                                <th><strong>Founded</strong></th>
                                <td>{data.bq_legal_entity_date_founded}</td>
                            </tr>

                            <tr>
                                <th><strong>Address</strong></th>
                                <td>{data.bq_legal_entity_address1_line_1} {data.bq_legal_entity_address1_line_2} <br />{data.bq_legal_entity_address1_city}, {data.bq_legal_entity_address1_state} {data.bq_legal_entity_address1_zip5}<br /></td>
                            </tr>
                            <tr>
                                <th><strong>Jurisdiction</strong></th>
                                <td>{data.bq_legal_entity_jurisdiction_code}</td>
                            </tr>
                            <tr>
                                <th><strong>Ticker</strong></th>
                                <td>{data.bq_ticker_parent} {data.bq_ticker}</td>
                            </tr>
                            <tr>
                                <th><strong>Tracking</strong></th>
                                <td>UID: {data.bq_legal_entity_ultimate_parent_id}<br />PID: {data.bq_legal_entity_parent_id}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="viewBoxCol">
                    <h3>Status</h3>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th><strong>Legal Status</strong></th>
                                <td>{data.bq_legal_entity_current_status}</td>
                            </tr>
                            <tr>
                                <th><strong>Entity Status</strong></th>
                                <td>{data.bq_legal_entity_isactive === "1" && <span>Active</span>}
                                    {data.bq_legal_entity_isactive === "0" && <span>Inactive</span>}</td>
                            </tr>
                            <tr>
                                <th><strong>Address</strong></th>
                                <td>{data.bq_legal_entity_address1_rdi}</td>
                            </tr>
                            <tr>
                                <th><strong>Operating/Shell</strong></th>
                                <td>
                                    {data.bq_non_company_indicator === "1" && <span>Yes</span>}
                                    {data.bq_non_company_indicatorr === "0" && <span>No</span>}</td>
                            </tr>
                            <tr>
                                <th><strong>For/Non-Profit</strong></th>
                                <td>
                                    {data.bq_non_profit_indicator === "1" && <span>Yes</span>}
                                    {data.bq_non_profit_indicator === "0" && <span>No</span>}
                                </td>
                            </tr>

                            <tr>
                                <th><strong>Company Type</strong></th>
                                <td>{data.bq_legal_entity_company_type}</td>
                            </tr>

                            <tr>
                                <th><strong>Org Type</strong></th>
                                <td>{data.bq_legal_entity_organization_type}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="viewBoxCol">
                    <h3>Firmographics</h3>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th><strong>Revenue</strong></th>
                                <td><NumericFormat value={data.bq_revenue_mr} prefix={'$'} displayType={'text'} allowLeadingZeros thousandSeparator="," /></td>
                            </tr>
                            <tr>
                                <th><strong>Head Count</strong></th>
                                <td><NumericFormat value={data.bq_current_employees_plan_mr} displayType={'text'} allowLeadingZeros thousandSeparator="," /></td>
                            </tr>
                            <tr>
                                <th><strong>BQ Score</strong></th>
                                <td>{data.bq_score}</td>
                            </tr>
                            <tr>
                                <th><strong>Growth-Rate:</strong></th>
                                <td><NumericFormat value={data.bq_current_employees_plan_growth_yoy_mr * 100} suffix={'%'} displayType={'text'} decimalScale={1} /> </td>
                            </tr>
                            <tr>
                                <th><strong>IRS Sector</strong></th>
                                <td>{data.bq_sector_name} ({data.bq_sector_code})</td>
                            </tr>
                            <tr>
                                <th><strong>NAICS Sector</strong></th>
                                <td>{data.bq_naics_sector_name} ({data.bq_naics_sector_code})</td>
                            </tr>
                            <tr>
                                <th><strong>NAICS Ind Code</strong></th>
                                <td>{data.bq_naics_code}</td>
                            </tr>
                            <tr>
                                <th><strong>Establishments</strong></th>
                                <td>{data.bq_us_de_legal_entity_establishment_count}</td>
                            </tr>
                            <tr>
                                <th><strong>Entity Count</strong></th>
                                <td>{data.bq_us_de_legal_entity_children_count}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const getTreeItemsFromData = (treeItems) => {
    let children = undefined;
    if (treeItems.children) {
        children = treeItems.children;
    }
    return (
        <li key={treeItems.id}>
            {viewBox(treeItems, 1)}
            {subTree(children)}
        </li>
    );
};


const subTree = (data) => {
    return (
        <ul key="sub" className="sub">
            {Object.keys(data).map((hit) => {
                let schildren = undefined;
                let pdata = data[hit];
                if (pdata.children) {
                    schildren = pdata.children;
                }
                if (schildren === undefined) {
                    return <li key={pdata.id}>{viewBox(pdata, 0)}</li>;
                } else {
                    return (
                        <li key={pdata.id}>
                            {viewBox(pdata, 0)}
                            {subTree(schildren)}
                        </li>
                    );
                }
            })}
        </ul>
    );
};

const DisplayTree = (props) => {
    const wdata = formatData(props.data);
    return (
        <>
            <ul key="listView" className="listView">
                {Object.keys(wdata).map((hit) => {
                    return getTreeItemsFromData(wdata[hit]);
                })}
            </ul>
        </>
    );
};

const TreeView = (props) => {
    const url = "https://wd3vh9rpkoy6me80p-1.a1.typesense.net/collections/bq_entities_family_v5/documents/search";
    const [posts, setPosts] = useState([]);
    const [loaded, setLoaded] = useState(false); // Add state variable

    const jid = useMemo(() => {
        return props.data.pid === "" ? props.data.id : props.data.pid;
    }, [props.data.pid, props.data.id]);

    useEffect(() => {
        if (!loaded) { // Check if data has already been loaded
            axios
                .get(url, {
                    params: {
                        query_by: "bq_legal_entity_id, bq_legal_entity_ultimate_parent_id",
                        q: jid,
                        per_page: 20,
                        drop_tokens_threshold: 0,
                        typo_tokens_threshold: 0,
                        num_typos: 0
                    },
                    headers: { "X-TYPESENSE-API-KEY": "tXeuzkvrjreTKuUrh4nD5FIrJEsfTck8" }
                })
                .then(function (response) {
                    if (response.status === 200) {
                        const data = response.data.hits;
                        setPosts(data);
                        setLoaded(true); // Set loaded state to true
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [jid, loaded]); // Add loaded state to dependency array

    return <><ErrorBoundary>{posts.length > 0 ? <DisplayTree data={posts} /> : "Loading..."}</ErrorBoundary></>;
};

export default TreeView;
