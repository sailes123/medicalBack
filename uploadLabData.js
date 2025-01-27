//node uploadLabData.js => to populate the database
const  pool  = require("./database/db");


async function insertLabData(labData) {
  const connection = await pool.getConnection();

  try {
    for (const lab of labData) {
      // Insert lab details
      const labResult = await connection.execute(
        "INSERT INTO lab (Name, Location, PhoneNumber, OpeningHours) VALUES (?, ?, ?, ?)",
        [lab.name, lab.location, lab.phoneNumber, lab.openingHours]
      );
      const labId = labResult[0].insertId;

      // Insert available tests for the lab
      for (const test of lab.availableTests) {
        await connection.execute(
          "INSERT INTO test (LabID, TestName, TestPrice, Description) VALUES (?, ?, ?, ?)",
          [labId, test.testName, test.testPrice, test.description]
        );
      }
    }

    await connection.commit();
  } catch (error) {
    console.error("Failed to insert lab data:", error);
    await connection.rollback();
  } finally {
    connection.release();
  }
}

const labData = [
  {
    id: 1,
    name: "HealthLab",
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM",
    location: "Bansbari, Kathmandu",
    phoneNumber: "555-1234",
    availableTests: [
      {
        testName: "Blood Test",
        testPrice: "$50",
        description: "Complete blood count",
      },
      {
        testName: "Urinalysis",
        testPrice: "$30",
        description: "Analysis of urine components",
      },
      {
        testName: "Cholesterol Test",
        testPrice: "$40",
        description: "Measures cholesterol levels",
      },
    ],
  },
  {
    id: 2,
    name: "MediScan",
    openingHours: "Mon-Sat: 7:30 AM - 6:00 PM",
    location: "Zero Km, Pokhara",
    phoneNumber: "555-5678",
    availableTests: [
      {
        testName: "MRI Scan",
        testPrice: "$300",
        description: "Magnetic Resonance Imaging",
      },
      {
        testName: "X-ray",
        testPrice: "$80",
        description: "Radiographic imaging",
      },
      {
        testName: "Ultrasound",
        testPrice: "$120",
        description: "Diagnostic imaging using sound waves",
      },
    ],
  },
  {
    id: 3,
    name: "LabExpress",
    openingHours: "Mon-Fri: 7:00 AM - 6:00 PM",
    location: "Chardobato, Bhaktapur",
    phoneNumber: "555-9012",
    availableTests: [
      {
        testName: "Hemoglobin A1c",
        testPrice: "$35",
        description: "Diabetes monitoring",
      },
      {
        testName: "Thyroid Function Test",
        testPrice: "$45",
        description: "Evaluates thyroid health",
      },
      {
        testName: "Vitamin D Test",
        testPrice: "$25",
        description: "Measures vitamin D levels",
      },
    ],
  },
  {
    id: 4,
    name: "CityDiagnostics",
    openingHours: "Mon-Sat: 8:30 AM - 7:00 PM",
    location: "Tansen, Palpa",
    phoneNumber: "555-3456",
    availableTests: [
      {
        testName: "Lipid Panel",
        testPrice: "$55",
        description: "Measures cholesterol levels",
      },
      {
        testName: "Liver Function Test",
        testPrice: "$40",
        description: "Evaluates liver health",
      },
      {
        testName: "HIV Test",
        testPrice: "$60",
        description: "Detects HIV antibodies",
      },
    ],
  },
  {
    id: 5,
    name: "Wellness Diagnostics",
    openingHours: "Mon-Fri: 9:00 AM - 5:30 PM, Sat: 10:00 AM - 2:00 PM",
    location: "Baneswor, Kathmandu",
    phoneNumber: "555-6789",
    availableTests: [
      {
        testName: "Prostate-Specific Antigen (PSA) Test",
        testPrice: "$50",
        description: "Screening for prostate cancer",
      },
      {
        testName: "C-Reactive Protein (CRP) Test",
        testPrice: "$30",
        description: "Inflammation marker",
      },
      {
        testName: "Pap Smear",
        testPrice: "$65",
        description: "Cervical cancer screening",
      },
    ],
  },
  {
    id: 6,
    name: "QuickLab",
    openingHours: "Mon-Sat: 7:00 AM - 7:00 PM",
    location: "Kalanki, Kathmandu",
    phoneNumber: "555-7890",
    availableTests: [
      {
        testName: "Allergy Testing",
        testPrice: "$75",
        description: "Identifies allergic reactions",
      },
      {
        testName: "Bone Density Test",
        testPrice: "$90",
        description: "Assesses bone health",
      },
      {
        testName: "Stool Analysis",
        testPrice: "$35",
        description: "Examines fecal matter for health indicators",
      },
    ],
  },
  {
    id: 7,
    name: "Precision Labs",
    openingHours: "Mon-Fri: 8:00 AM - 6:30 PM",
    location: "Gongabu, Kathmandu",
    phoneNumber: "555-8901",
    availableTests: [
      {
        testName: "Genetic Testing",
        testPrice: "$120",
        description: "Analyzes genetic material for health risks",
      },
      {
        testName: "Throat Culture",
        testPrice: "$40",
        description: "Identifies bacterial infections",
      },
      {
        testName: "Coagulation Panel",
        testPrice: "$55",
        description: "Evaluates blood clotting abilities",
      },
    ],
  },
  // Add more labs and tests as needed
];

// Use the function with your labData
insertLabData(labData)
  .then(() => console.log("Lab data successfully inserted"))
  .catch((error) => console.error("Error inserting lab data:", error));
