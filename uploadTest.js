const pool = require("./database/db");

async function uploadBloodSugarTestData(data) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Insert into Tests table
    const [testResult] = await connection.query(
      `INSERT INTO Tests (Description, ResultTiming) VALUES (?, ?)`,
      [data.Description, data.ResultTiming]
    );

    const testId = testResult.insertId;

    // Insert into TestProcedure table
    await connection.query(
      `INSERT INTO TestProcedure (TestID, HowIsTestDone, Preparation) VALUES (?, ?, ?)`,
      [testId, data.Procedure.HowIsTestDone, data.Procedure.Preparation]
    );

    // Insert into ResultsInterpretation table
    for (const interpretation of data.ReadingInterpretation.Table) {
      await connection.query(
        `INSERT INTO ResultsInterpretation (TestID, TestCondition, FastingBloodSugar, PostprandialBloodSugar) VALUES (?, ?, ?, ?)`,
        [
          testId,
          interpretation.Condition,
          interpretation.FastingBloodSugar,
          interpretation.PostprandialBloodSugar,
        ]
      );
    }

    // Insert into PreventionAndCure table
    await connection.query(
      `INSERT INTO PreventionAndCure (TestID, Prevention, Cure) VALUES (?, ?, ?)`,
      [testId, data.PreventionAndCure.Prevention, data.PreventionAndCure.Cure]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Example usage with the provided data
const bloodSugarTestData = {
  Description:
    "A blood sugar test measures the amount of glucose in your blood. This test is used to diagnose and manage diabetes.",
  Procedure: {
    HowIsTestDone:
      "A healthcare provider will take a blood sample from a vein in your arm or a small prick on your fingertip.",
    Preparation:
      "You may need to fast (not eat or drink anything except water) for 8 to 12 hours before the blood sugar test.",
  },
  ResultTiming:
    "Results can vary by testing facility, but they are often available within a day or two.",
  ReadingInterpretation: {
    Table: [
      {
        Condition: "Normal",
        FastingBloodSugar: "70-99 mg/dL",
        PostprandialBloodSugar: "Less than 140 mg/dL",
      },
      {
        Condition: "Prediabetes",
        FastingBloodSugar: "100-125 mg/dL",
        PostprandialBloodSugar: "140 to 199 mg/dL",
      },
      {
        Condition: "Diabetes",
        FastingBloodSugar: "126 mg/dL or higher",
        PostprandialBloodSugar: "200 mg/dL or higher",
      },
    ],
  },
  PreventionAndCure: {
    Prevention:
      "Maintaining a healthy weight, eating a balanced diet, exercising regularly, and monitoring your blood sugar levels can help prevent diabetes.",
    Cure: "There is no cure for diabetes, but it can be managed with medication, diet, exercise, and blood sugar monitoring.",
  },
};

uploadBloodSugarTestData(bloodSugarTestData)
  .then(() => {
    console.log("Data uploaded successfully.");
  })
  .catch((error) => {
    console.error("Failed to upload data:", error);
  });
