const pool = require("../../database/db");

const fetchLabData = async (req, res) => {
  try {
    const [labs] = await pool.execute(
      `SELECT 
        L.LabID, L.Name, L.Location, L.PhoneNumber, L.OpeningHours,
        T.TestID, T.TestName, T.TestPrice, T.Description
       FROM lab L
       JOIN test T ON L.LabID = T.LabID
       ORDER BY L.LabID, T.TestID`
    );
    const labsWithTests = {};

    labs.forEach(row => {
      // If the lab hasn't been added to the result object, add it
      if (!labsWithTests[row.LabID]) {
        labsWithTests[row.LabID] = {
          id: row.LabID,
          name: row.Name,
          location: row.Location,
          phoneNumber: row.PhoneNumber,
          openingHours: row.OpeningHours,
          availableTests: []
        };
      }
      // Add the test to the lab's list of tests
      labsWithTests[row.LabID].availableTests.push({
        testName: row.TestName,
        testPrice: row.TestPrice,
        description: row.Description
      });
    });
    res.status(200).json(labsWithTests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const fetchTestData = async (req, res) => {
  try {
    const [tests] = await pool.execute(
      `
      SELECT 
          t.TestID,
          t.Description,
          t.ResultTiming,
          tp.HowIsTestDone,
          tp.Preparation,
          ri.TestCondition,
          ri.FastingBloodSugar,
          ri.PostprandialBloodSugar,
          pac.Prevention,
          pac.Cure
      FROM Tests t
      LEFT JOIN TestProcedure tp ON t.TestID = tp.TestID
      LEFT JOIN ResultsInterpretation ri ON t.TestID = ri.TestID
      LEFT JOIN PreventionAndCure pac ON t.TestID = pac.TestID
  `
    );

    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { fetchLabData , fetchTestData };
