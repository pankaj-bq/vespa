import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary";
import { NumericFormat } from 'react-number-format';

const Quarterly = ({ data }) => { 
    if(data[0].document.historical_data !== ''){
        const quarterlyRevenueByYear = {}; 
        Object.keys(data).map((hit) => {
            const subdata = data[hit];
            const d = subdata.document;
    
            const { quarterly_revenue } = JSON.parse(d.historical_data);

            quarterly_revenue.forEach(({ year, quarter, revenue }) => {
                if (!quarterlyRevenueByYear[year]) {
                    quarterlyRevenueByYear[year] = [];
                }

                quarterlyRevenueByYear[year].push({ quarter, revenue });
            });

        });
    
        return (
            <table className="table">
                <thead>
                    <tr><th>PERIOD</th><th className="right">Revenue</th></tr>
                </thead>
                <tbody>
                    {Object.entries(quarterlyRevenueByYear).map(([year, data]) => (
                        data.map(({ quarter, revenue }) => (
                            <React.Fragment key={`${year}-${quarter}-${revenue}`}>
                                <tr key={year}>
                                    <td>{`Q-${parseInt(quarter)}`} {year}</td><td className="right">
                                    <NumericFormat value={revenue} prefix={'$'} displayType={'text'} allowLeadingZeros thousandSeparator="," /> 
                                    
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))
                    ))}
                </tbody>
            </table>
        ) 
                    }else{
                        return (<>No Data</>)
                    }
};

const Monthly = ({ data }) => {
    if(data[0].document.historical_data !== ''){
    let monthlyEmploymentByYear = {};  
    Object.keys(data).map((hit) => {
        const subdata = data[hit];
        const d = subdata.document;
        
        const { monthly_employment } = JSON.parse(d.historical_data);
        monthly_employment.forEach(({ year, month, headcount }) => {
            if (!monthlyEmploymentByYear[year]) {
                monthlyEmploymentByYear[year] = [];
            }
            monthlyEmploymentByYear[year].push({ month, headcount });
        });
    });

    const dy = {
        "1": "Jan",
        "2": "Feb",
        "3": "Mar",
        "4": "Apr",
        "5": "May",
        "6": "Jun",
        "7": "Jul",
        "8": "Aug",
        "9": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    }

   

    return (
        <table className="table">
            <thead>
                <tr><th>PERIOD</th><th className="right">HEADCOUNT</th></tr>
            </thead>
            <tbody>
                {Object.entries(monthlyEmploymentByYear).sort((a, b) => b[0] - a[0]).map(([year, data]) => (
                    data.sort((a, b) => b.month - a.month).map(({ month, headcount }) => (
                        <React.Fragment key={`${year}-${month}-${headcount}`}>
                            <tr key={year + '-me'}>
                                <td>{year} - {`${dy[parseInt(month)]}`}</td><td className="right">
                                <NumericFormat value={headcount} displayType={'text'} allowLeadingZeros thousandSeparator="," />
                                </td>
                            </tr>
                        </React.Fragment>
                    ))
                ))}
            </tbody>
        </table>
    )
                    }else{
                        return (<>No Data</>)
                    }
 
};

const HistoricalView = ({ data }) => {
    const url = "https://xj7sp01wcnhqmz49p-1.a1.typesense.net/collections/bq_historical_data_v2/documents/search";
    const [posts, setPosts] = useState([]);
    const [fetched, setFetched] = useState(false);

    const setDisplay = useCallback((id) => {
        //id = 10266173;
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
                        headers: { "X-TYPESENSE-API-KEY": "j5M8pSIQqn581TF9ddpAgQrUlIohAEj4" }
                    })
                    .then(function (response) {
                        if (response.status === 200) {
                            let data = response.data.hits;
                            setPosts(data);
                            console.log(data[0].document.historical_data)
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
        setDisplay(data);
    }, [data, setDisplay]); // Call setDisplay only once, when the component mounts
    
    return (
        <ErrorBoundary>
            {posts.length > 0 ? (
                <>
                    <h3>Quarterly Revenue</h3> 
                    <Quarterly data={posts}></Quarterly>
                    <h3>Monthly Employment</h3>
                    <Monthly data={posts}></Monthly>
                     
                </>
            ) : (
                fetched ? (
                    <p>No Historical Data</p>
                ) : (
                    <button className="btnNew" onClick={() => setDisplay(data)}>Load Historical Data</button>
                )
            )}
        </ErrorBoundary>
    );
};

export default HistoricalView;
