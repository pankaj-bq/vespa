import React, { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

import {
    InstantSearch,
    Hits,
    SearchBox,
    ClearRefinements,
    MenuSelect,
} from "react-instantsearch-dom";
import VespaInstantSearchAdapter from "./VespaInstantSearchAdapter";

function formatPercentage(value, decimalPlaces = 2) {
    if (typeof value !== 'number') return '';

    const formattedValue = (value * 100).toFixed(decimalPlaces);
    return `${formattedValue}%`;
}

function formatNumber(value, decimalPlaces = 0) {
    if (typeof value !== 'number') return '';

    const options = {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    };

    return value.toLocaleString(undefined, options);
}


const searchAdapter = new VespaInstantSearchAdapter({ vespaUrl: process.env.REACT_APP_VESPA_URL, indexName: 'firmographics' });

const CompanySearchView = () => {
    const [display, setDisplay] = useState(0);
    const [id, setId] = useState(0);
    const [lid, setLid] = useState(0);
    const [pid, setPid] = useState(0);

    const setData = (v, id, lid, pid) => {
        setDisplay(v);
        setId(id);
        setLid(lid);
        setPid(pid);
    };

    const Hit = (props) => {
        return (
            <>
                <div className="tableView">
                    <div className="listCol listCol-2">
                        {props.hit.bq_company_lfo}
                    </div>
                    <div className="listCol listCol-3">
                        <strong>{props.hit.bq_company_legal_name}</strong><br />{props.hit.bq_legal_entity_id}
                    </div>
                    <div className="listCol listCol-4">
                        {props.hit.bq_company_address1_line_1 && (
                            <div>{props.hit.bq_company_address1_line_1}</div>
                        )}
                        {props.hit.bq_company_address1_line_2 && (
                            <div>{props.hit.bq_company_address1_line_2}</div>
                        )}
                        {props.hit.bq_company_address1_state && (
                            <div>{props.hit.bq_company_address1_state}</div>
                        )}
                        {props.hit.bq_company_address1_zip5 && (
                            <div>{props.hit.bq_company_address1_zip5}</div>
                        )}
                        {props.hit.bq_company_fgn_address1_cntry && (
                            <div>{props.hit.bq_company_fgn_address1_cntry}</div>
                        )}
                    </div>
                    <div className="listCol listCol-5">
                        {
                            [
                                props.hit.bq_company_contact_name && `Contact Name: ${props.hit.bq_company_contact_name}`,
                                props.hit.bq_company_address1_state_name && `Jurisdiction: ${props.hit.bq_company_address1_state_name}`,
                                props.hit.bq_year_founded && `Founded: ${props.hit.bq_year_founded}`,
                                props.hit.bq_company_isactive !== undefined && `Status: ${props.hit.bq_company_isactive ? 'Active' : 'Inactive'}`,
                                props.hit.bq_id && `BQ ID: ${props.hit.bq_id}`,
                                props.hit.bq_organization_id && `BQ Organization ID: ${props.hit.bq_organization_id}`,
                                props.hit.bq_legal_entity_id && `Legal Entity ID: ${props.hit.bq_legal_entity_id}`,
                                props.hit.bq_ticker && `Ticker: ${props.hit.bq_ticker}`,
                                props.hit.bq_cik && `CIK: ${props.hit.bq_cik}`
                            ].filter(Boolean).map((item, index) => (
                                <div key={index}>{item}</div>
                            ))
                        }
                    </div>

                    <div className="listCol listCol-6">
                        {
                            [
                                props.hit.bq_industry_name && `IRS Sector: ${props.hit.bq_industry_name}`,
                                props.hit.bq_subsector_name && `Sub Sector: ${props.hit.bq_subsector_name}`,
                                props.hit.bq_naics_description && `NAICS Title: ${props.hit.bq_naics_description}`,
                                props.hit.bq_sic_description && `SIC Description: ${props.hit.bq_sic_description}`,
                                props.hit.bq_sic_sector_name && `SIC Sector: ${props.hit.bq_sic_sector_name}`
                            ].filter(Boolean).map((item, index) => (
                                <div key={index}>{item.split(';')[0]}</div>
                            ))
                        }
                    </div>

                    <div className="listCol listCol-7">
                        {props.hit.companyvariablesmostrecent && (
                            <>
                                {[
                                    props.hit.companyvariablesmostrecent.bq_revenue_mr && `Revenue: ${formatNumber(props.hit.companyvariablesmostrecent.bq_revenue_mr)}`,
                                    props.hit.companyvariablesmostrecent.bq_net_income_mr && `Net Income: ${formatNumber(props.hit.companyvariablesmostrecent.bq_net_income_mr)}`,
                                    props.hit.companyvariablesmostrecent.bq_total_assets_mr && `Total Assets: ${formatNumber(props.hit.companyvariablesmostrecent.bq_total_assets_mr)}`,
                                    props.hit.companyvariablesmostrecent.bq_ebitda_mr && `EBITDA: ${formatNumber(props.hit.companyvariablesmostrecent.bq_ebitda_mr)}`,
                                    props.hit.companyvariablesmostrecent.bq_return_on_assets_mr &&
                                    `Return on Assets: ${formatPercentage(props.hit.companyvariablesmostrecent.bq_return_on_assets_mr)}`,
                                ]
                                    .filter(Boolean)
                                    .map((item, index) => (
                                        <div key={index}>{item}</div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>
            </>
        )
    }

    return (
        <ErrorBoundary>
            <InstantSearch
                indexName="firmographics"
                searchClient={searchAdapter}
            >
                <div className="main-aside">
                    <h4>Filter</h4>
                    <label>Filter by Company Type</label>
                    <MenuSelect
                        attribute="bq_company_lfo"
                        hitsPerPage={20}
                        limit={20}
                        facetOrdering
                    >
                    </MenuSelect>
                    <label>Filter by IRS Sector</label>
                    <MenuSelect
                        attribute="bq_industry_name"
                        hitsPerPage={20}
                        limit={20}
                        facetOrdering

                    ></MenuSelect>
                    <label>Filter by States</label>
                    <MenuSelect
                        attribute="bq_company_address1_state_name"
                        hitsPerPage={20}
                        limit={20}
                        facetOrdering

                    ></MenuSelect>
                    <label>Filter by Status</label>
                    <MenuSelect
                        attribute="bq_company_isactive"
                        hitsPerPage={20}
                        limit={20}
                        facetOrdering
                        transformItems={(items) =>
                            items.map((item) => ({
                                ...item,
                                label: String(item.value) === 'true' ? 'Active' : 'Inactive',
                            }))
                        }
                    ></MenuSelect>
                    <label>Filter by Trade Status</label>
                    <MenuSelect
                        attribute="bq_public_indicator"
                        hitsPerPage={20}
                        limit={20}
                        facetOrdering
                        transformItems={(items) =>
                            items.map((item) => ({
                                ...item,
                                label: String(item.value) === 'true' ? 'Public' : 'Private',
                            }))
                        }
                    ></MenuSelect>
                    <ClearRefinements />
                </div>
                <div className="main-content">
                    <div className="search-box">
                        <SearchBox defaultRefinement="AMAZON CONSTRUCTION CO., INC"></SearchBox>
                    </div>
                    <div className="results">
                        {
                            display === 1 ? (
                                <>
                                    <div className="topBar">
                                        <button className="btnNew" onClick={() => setDisplay(0)}>
                                            Go Back
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="searchResults">
                                        <div className="tableView tableView-top">
                                            <div className="listCol listCol-2">Type</div>
                                            <div className="listCol listCol-3">Entity</div>
                                            <div className="listCol listCol-4">Address</div>
                                            <div className="listCol listCol-5">Identifier/Status</div>
                                            <div className="listCol listCol-6">Industry Classification</div>
                                            <div className="listCol listCol-7">Financials</div>
                                        </div>
                                        <Hits hitComponent={Hit} />
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </InstantSearch>
        </ErrorBoundary>
    )
}
export default CompanySearchView;
