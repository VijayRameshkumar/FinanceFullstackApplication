import React, { useState, useEffect } from 'react';
import { getVesselTypes, getVesselSubtypes,filterInpuyts, filterReportData } from '../services/api'; // Import API calls
import BudgetAnalysisTrend from './BudgetAnalysisTrend';
import BudgetAnalysisReport from './BudgetAnalysisReport';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const BudgetAnalysis = () => {
  const theme = useTheme();
  const [currentView, setCurrentView] = useState('report');

  const [vesselTypes, setVesselTypes] = useState(['BULK CARRIER']); // For vessel types dropdown
  const [vesselSubtypes, setVesselSubtypes] = useState(['HANDYSIZE']); // For vessel subtypes dropdown
  const [categories, setCategories] = useState(['Select All']); // Categories dropdown
  const [subCategories, setSubCategories] = useState(['Select All']); // Sub-categories dropdown
  const [vessels, setVessels] = useState(['Select All']); // Selected vessels dropdown

  const [vesselAgeStart, setVesselAgeStart] = useState(0);
  const [vesselAgeEnd, setVesselAgeEnd] = useState(20);
  const [agevalue, setAgeValue] = useState([0, 20]);
  const [vesselsCount, setVesselsCount] = useState(0);

  const [selectedVesselType, setSelectedVesselType] = useState('BULK CARRIER'); // Default value
  const [selectedVesselSubtype, setSelectedVesselSubtype] = useState(['HANDYSIZE']);
  const [selectedCategories, setSelectedCategories] = useState(['Select All']);
  const [selectedSubCategories, setSelectedSubCategories] = useState(['Select All']); // Selected vessels dropdown
  const [selectedVessels, setSelectedVessels] = useState(['Select All']); // Selected vessels dropdown

  const [budgetCatData, setBudgetCatData] = useState([]);
  const [budgetSubcatData, setBudgetSubcatData] = useState([]);
  const [nonBudgetCatData, setNonBudgetCatData] = useState([]);
  const [nonBudgetSubcatData, setNonBudgetSubcatData] = useState([]);
  const [eventSubcatData, setEventSubcatData] = useState([]);

  const [plotlyMonthlyQuartilesData, setPlotlyMonthlyQuartilesData] = useState([]);
  const [plotlyYearlyQuartilesData, setPlotlyYearlyQuartilesData] = useState([]);

  function valuetext(value) {
    return `${value}`;
  }

  const handleAgeChange = (event, newValue) => {
    setVesselAgeStart(newValue[0]);
    setVesselAgeEnd(newValue[1]);
    setAgeValue(newValue);
    // fetchFilterReportData();

  };

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 20,
      label: '20',
    }
  ];

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 100,
        width: 250,
      },
    },
  };

  function getStyles(name, values, theme) {
    return {
      fontWeight: values.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  const categorieshandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    fetchFilterReportData();
  };

  const subTypeshandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedVesselSubtype(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    fetchFilterReportData();
  };

  const subCategoriesHandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSubCategories(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    fetchFilterReportData();
  };


  const selectedVesselshandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setVessels(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    fetchFilterReportData();
  };

  useEffect(() => {
    // Fetch initial data for Vessel Types and Subtypes when page loads
    fetchVesselTypesData();
    fetchVesselSubtypesData(selectedVesselType);
    fetchFilterReportData();
    fetchInputsData();
  }, []);

  // Fetch Vessel Types from API
  const fetchVesselTypesData = async () => {
    try {
      const response = await getVesselTypes();
      setVesselTypes(response.data);
    } catch (error) {
      console.error('Error fetching vessel types:', error);
    }
  };

  // Fetch Vessel Subtypes when vessel type changes
  const fetchVesselSubtypesData = async (vesselType) => {
    try {
      const response = await getVesselSubtypes(vesselType);
      setVesselSubtypes(response.data);
    } catch (error) {
      console.error('Error fetching vessel subtypes:', error);
    }
  };

    // Fetch inputs data when the page loads
    const fetchInputsData = async () => {
      try {
        const filterParams = {
          vessel_type: selectedVesselType,
          vessel_subtype: selectedVesselSubtype,
          vessel_age_start: vesselAgeStart,
          vessel_age_end: vesselAgeEnd,
          vessel_cat: categories,
          vessel_subcat: subCategories,
          selected_vessels_dropdown: selectedVessels
        };
        const response = await filterInpuyts(filterParams);
  
        setCategories(response.data.vessel_cat_options);
        setSubCategories(response.data.vessel_subcat_options);
        setSelectedVessels(response.data.selected_vessels_option);
        setVesselsCount(response.data.vessels_selected_count);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

  // Fetch filtered report data when the page loads
  const fetchFilterReportData = async () => {
    try {
      const filterParams = {
        vessel_type: selectedVesselType,
        vessel_subtype: selectedVesselSubtype,
        vessel_age_start: vesselAgeStart,
        vessel_age_end: vesselAgeEnd,
        vessel_cat: categories,
        vessel_subcat: subCategories,
        selected_vessels_dropdown: selectedVessels
      };

      setBudgetCatData([]);
      setBudgetSubcatData([]);
      setNonBudgetCatData([]);
      setNonBudgetSubcatData([]);
      setEventSubcatData([]);

      const response = await filterReportData(filterParams);

      setBudgetCatData(response.data.budget_cat_data);
      setBudgetSubcatData(response.data.budget_subcat_data);
      setNonBudgetCatData(response.data.non_budget_cat_data);
      setNonBudgetSubcatData(response.data.nonbudget_subcat_data);
      setEventSubcatData(response.data.event_subcat_data);

      setPlotlyMonthlyQuartilesData(response.data.plotly_monthly_quartiles_data);
      setPlotlyYearlyQuartilesData(response.data.plotly_yearly_quartiles_data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const handleVesselTypeChange = (event) => {
    const _vesselType = event.target.value;
    setSelectedVesselType(_vesselType);
    fetchVesselSubtypesData(_vesselType); // Fetch subtypes based on vessel type
  };

  const handleViewSwitch = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="p-4 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Analysis</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleViewSwitch('report')}
            className={`px-4 py-2 rounded-md ${currentView === 'report' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Report
          </button>
          <div className="h-6 w-px bg-gray-400"></div>
          <button
            onClick={() => handleViewSwitch('trend')}
            className={`px-4 py-2 rounded-md ${currentView === 'trend' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Trend
          </button>
        </div>
      </div>
      <p className="mt-4">Synergy Budget Analysis Tool Version 1.0</p>
      {/* Horizontal Divider */}
      <hr className="my-6 border-gray-300" />

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-bold mb-2">Vessel Type</label>
          <select
            value={selectedVesselType}
            onChange={handleVesselTypeChange}
            className="w-full px-3 py-2 border rounded"
          >
            {vesselTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold mb-2">Vessel Subtype</label>

          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-name-label">Subtype</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={selectedVesselSubtype}
              onChange={subTypeshandleChange}
              input={<OutlinedInput label="Subtype" />}
              MenuProps={MenuProps}
            >
              {vesselSubtypes.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, vesselSubtypes, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </div>

        <div >
          <label className="block font-bold mb-2">Vessel Age Range</label>
          <div className="flex items-center space-x-4">
            <Slider
              getAriaLabel={() => 'Age range'}
              value={agevalue}
              onChange={handleAgeChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              min={0}
              max={20}
              marks={marks}
            />
          </div>
        </div>

        {/* Second row: Categories, Sub Categories, and Selected Vessels */}
        <div>
          <label className="block font-bold mb-2">Categories</label>

          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-name-label">Categories</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={selectedCategories}
              onChange={categorieshandleChange}
              input={<OutlinedInput label="Categories" />}
              MenuProps={MenuProps}
            >
              {categories.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, categories, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </div>

        <div>
          <label className="block font-bold mb-2">Sub Categories</label>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-name-label">Sub Categories</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={selectedSubCategories}
              onChange={subCategoriesHandleChange}
              input={<OutlinedInput label="SubCategories" />}
              MenuProps={MenuProps}
            >
              {subCategories.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, subCategories, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


        </div>

        <div>
          <label className="block font-bold mb-2">Selected Vessels</label>

          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-name-label">Vessels</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={selectedVessels}
              onChange={selectedVesselshandleChange}
              input={<OutlinedInput label="Vessels" />}
              MenuProps={MenuProps}
            >
              {vessels.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, categories, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>



        </div>
      </div>
      <div>
        <label className="block font-bold mb-2 pt-3">Vessels Selected Count : {vesselsCount}</label>
      </div>
      {/* Horizontal Divider */}
      <hr className="my-6 border-gray-300" />

      {/* Conditionally render the selected view */}
      <div className="mt-3">
        {currentView === 'report' && <BudgetAnalysisReport budgetCatData={budgetCatData} budgetSubcatData={budgetSubcatData} nonBudgetCatData={nonBudgetCatData} nonBudgetSubcatData={nonBudgetSubcatData} eventSubcatData={eventSubcatData} />}
        {currentView === 'trend' && <BudgetAnalysisTrend plotlyMonthlyQuartilesData={plotlyMonthlyQuartilesData} plotlyYearlyQuartilesData={plotlyYearlyQuartilesData} />}
      </div>
    </div>
  );
};

export default BudgetAnalysis;
