import React, { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import CompanySearchView from "./CompanySearchView";


const Tab = ({ tabs, activeTab, setActiveTab }) => {
    const showButton = tabs.length > 1;

    return (
        <div className="tabs">
            <div className="tobNav">
                <div className="main-aside"></div>
                <div className="main-content">
                    {showButton && (
                        <button
                            type="button"
                            className={`tab ${activeTab === 0 ? "active" : ""}`}
                            onClick={() => setActiveTab(0)}
                        >
                            {tabs[0].label}
                        </button>
                    )}
                </div>
            </div>
            <div className="tab-content">{tabs[activeTab].content}</div>
        </div>
    );
};

const TabView = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        {
            label: "Search By Company",
            content: <div><CompanySearchView /></div>
        },
    ];
    return (
        <ErrorBoundary>
            <div className="container">
                <Tab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </ErrorBoundary>
    )
}
export default TabView;
