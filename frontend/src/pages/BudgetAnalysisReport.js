import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CollapsibleTable from '../components/CollapsibleTable';
import React, { useState, useEffect } from 'react';
import { getUserPermissions } from '../services/api'; // Import API calls

const BudgetAnalysisReport = ({ budgetCatData, budgetSubcatData, eventSubcatData, nonBudgetSubcatData, nonBudgetCatData }) => {
 
  const [allow, setAllow] = useState(false);
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('id');
        if (token) {
          const response = await getUserPermissions(user_id);
          setAllow(response.data.can_download);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold pb-5">Budget Analysis - Report View</h2>
      <Tabs>
        <TabList>
          <Tab>BUDGET CATEGORIES</Tab>
          <Tab>ADDITIONAL CATEGORIES</Tab>
          <Tab>EVENT CATEGORIES</Tab>
        </TabList>

        {/* Tab for the Excel Template */}
        <TabPanel>
          <h2 className="text-1xl font-bold pb-5 pt-10">CATEGORY LEVEL BUDGET - PER MONTH</h2>
          <div>
            {/* Render the CollapsibleTable with the budgetCatData */}
            {(budgetCatData.length == 0) ? (
              <p className="text-red-500 pl-5">Data is Loading or Not Avaliable. Please Wait....</p>
            ) : (
              <CollapsibleTable data={budgetCatData} allow={allow}/>
            )}
          </div>

          <h2 className="text-1xl font-bold pb-5 pt-10">SUB-CATEGORY LEVEL BUDGET - PER MONTH</h2>
          <div>
            {/* Render the CollapsibleTable with the budgetCatData */}
            {(budgetSubcatData.length == 0) ? (
              <p className="text-red-500 pl-5">Data is Loading or Not Avaliable. Please Wait....</p>
            ) : (
              <CollapsibleTable data={budgetSubcatData} allow={allow}/>
            )}
          </div>

        </TabPanel>

        <TabPanel>
          <h2 className="text-1xl font-bold pb-5 pt-10">CATEGORY LEVEL BUDGET - PER MONTH</h2>
          <div>
            {/* Render the CollapsibleTable with the budgetCatData */}
            {(nonBudgetCatData.length == 0) ? (
              <p className="text-red-500 pl-5">Data is Loading or Not Avaliable. Please Wait....</p>
            ) : (
              <CollapsibleTable data={nonBudgetCatData} allow={allow} />
            )}
          </div>

          <h2 className="text-1xl font-bold pb-5 pt-10">SUB-CATEGORY LEVEL BUDGET - PER MONTH</h2>

          <div>
            {/* Render the CollapsibleTable with the budgetCatData */}
            {(nonBudgetSubcatData.length == 0) ? (
              <p className="text-red-500 pl-5">Data is Loading or Not Avaliable. Please Wait....</p>
            ) : (
              <CollapsibleTable data={nonBudgetSubcatData} allow={allow}/>
            )}
          </div>

        </TabPanel>
        {/* Tab for the PDF Report */}
        <TabPanel>
          <h2 className="text-1xl font-bold pb-5 pt-10">SUB-CATEGORY LEVEL BUDGET - PER EVENT</h2>
  
          <div>
            {/* Render the CollapsibleTable with the budgetCatData */}
            {(eventSubcatData.length == 0) ? (
              <p className="text-red-500 pl-5">Data is Loading or Not Avaliable. Please Wait....</p>
            ) : (
              <CollapsibleTable data={eventSubcatData} allow={allow}/>
            )}
          </div>

        </TabPanel>
      </Tabs>
    </div>
  );
};

export default BudgetAnalysisReport;
