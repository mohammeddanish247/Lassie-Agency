"use client"
import * as FileSystem from "expo-file-system"
import * as Print from "expo-print"
import * as Sharing from "expo-sharing"
import { forwardRef, useImperativeHandle } from "react"
import { Alert } from "react-native"

interface PDFGeneratorProps {
  candidate: any
}

interface PDFGeneratorRef {
  sharePDF: () => Promise<void>
  downloadPDF: () => Promise<void>
}

const PDFGenerator = forwardRef<PDFGeneratorRef, PDFGeneratorProps>(({ candidate }, ref) => {
  // Function to parse and format language skills
  const formatLanguageSkills = (languagesData: any) => {
    if (!languagesData || typeof languagesData !== "object") {
      return '<div class="info-value">No language information available</div>'
    }

    const languages: {
      name: string
      read: boolean
      spoken: boolean
      written: boolean
    }[] = []

    // Extract language data
    const languageKeys = Object.keys(languagesData).filter((key) => key.startsWith("Language") && !key.includes("_"))
    languageKeys.forEach((key) => {
      const languageName = languagesData[key]
      const languageNumber = key.replace("Language", "")
      if (languageName) {
        languages.push({
          name: languageName,
          read: languagesData[`Language${languageNumber}_read`] === "on",
          spoken: languagesData[`Language${languageNumber}_spoken`] === "on",
          written: languagesData[`Language${languageNumber}_written`] === "on",
        })
      }
    })

    if (languages.length === 0) {
      return '<div class="info-value">No languages specified</div>'
    }

    return languages
      .map(
        (lang) => `
    <div class="language-card">
      <div class="language-name">${lang.name}</div>
      <div class="language-skills">
        <div class="skill-item">
          <span class="skill-icon">📖</span>
          <span class="skill-label">Read:</span>
          <span class="skill-status ${lang.read ? "skill-yes" : "skill-no"}">${lang.read ? "✓" : "✗"}</span>
        </div>
        <div class="skill-item">
          <span class="skill-icon">🗣️</span>
          <span class="skill-label">Speak:</span>
          <span class="skill-status ${lang.spoken ? "skill-yes" : "skill-no"}">${lang.spoken ? "✓" : "✗"}</span>
        </div>
        <div class="skill-item">
          <span class="skill-icon">✍️</span>
          <span class="skill-label">Write:</span>
          <span class="skill-status ${lang.written ? "skill-yes" : "skill-no"}">${lang.written ? "✓" : "✗"}</span>
        </div>
      </div>
    </div>
  `,
      )
      .join("")
  }

  // Function to format experience details
  const formatExperienceDetails = (experienceData: any) => {
    // Handle both array format and single experience format
    let experienceDetails = []

    if (Array.isArray(experienceData)) {
      experienceDetails = experienceData
    } else if (experienceData && typeof experienceData === "object") {
      experienceDetails = [experienceData]
    } else if (candidate?.experience_details && Array.isArray(candidate.experience_details)) {
      experienceDetails = candidate.experience_details
    } else if (candidate?.experience_Job_title) {
      // Fallback to old single experience format
      experienceDetails = [
        {
          experience_Job_title: candidate.experience_Job_title,
          experience_Location: candidate.experience_Location,
          experience_Salary: candidate.experience_Salary,
          experience_From_To: candidate.experience_From_To,
          experience_Nature_of_Work: candidate.experience_Nature_of_Work,
          experience_Reason_for_leaving: candidate.experience_Reason_for_leaving,
        },
      ]
    }

    if (experienceDetails.length === 0) {
      return `
        <div class="experience-card">
          <div class="info-value" style="text-align: center; color: #666;">
            No experience information available
          </div>
        </div>
      `
    }

    return experienceDetails
      .map(
        (experience: any, index: number) => `
      <div class="experience-card" style="margin-bottom: 20px;">
        <div class="experience-title">
          ${experience?.experience_Job_title || `Experience ${index + 1}`}
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Location</div>
            <div class="info-value">${experience?.experience_Location || "N/A"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Salary</div>
            <div class="info-value">${experience?.experience_Salary || "N/A"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Duration</div>
            <div class="info-value">${experience?.experience_From_To || "N/A"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Nature of Work</div>
            <div class="info-value">${experience?.experience_Nature_of_Work || "N/A"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Reason for Leaving</div>
            <div class="info-value">${experience?.experience_Reason_for_leaving || "N/A"}</div>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  }

  const generateHTML = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Candidate Profile</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8fafc;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #5B94E2 0%, #4A7BC8 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(45deg, transparent 50%, white 50%);
        }
        
        .profile-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid white;
          margin: 0 auto 20px;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: white;
        }
        
        .header h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          font-weight: 300;
        }
        
        .header .subtitle {
          font-size: 1.2em;
          opacity: 0.9;
          font-weight: 300;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 10px;
          border-bottom: 2px solid #5B94E2;
        }
        
        .section-icon {
          font-size: 24px;
          margin-right: 15px;
          color: #5B94E2;
        }
        
        .section-title h2 {
          color: #5B94E2;
          font-size: 1.8em;
          font-weight: 600;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .info-item {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #5B94E2;
        }
        
        .info-label {
          font-weight: 600;
          color: #5B94E2;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        
        .info-value {
          color: #333;
          font-size: 1em;
          word-wrap: break-word;
        }
        
        .experience-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }

        .experience-card:last-child {
          margin-bottom: 0;
        }
        
        .experience-title {
          color: #5B94E2;
          font-size: 1.3em;
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #5B94E2;
        }

        /* Language Skills Styles */
        .languages-section {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .language-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 15px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .language-card:last-child {
          margin-bottom: 0;
        }

        .language-name {
          font-size: 1.3em;
          font-weight: 600;
          color: #5B94E2;
          margin-bottom: 15px;
          text-align: center;
        }

        .language-skills {
          display: flex;
          justify-content: space-around;
          gap: 15px;
        }

        .skill-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 12px;
          border-radius: 8px;
          min-width: 80px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .skill-icon {
          font-size: 24px;
          margin-right: 5px;
        }

        .skill-label {
          font-size: 0.9em;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          margin-right: 5px;
        }

        .skill-status {
          font-size: 20px;
          font-weight: bold;
        }

        .skill-yes {
          color: #22c55e;
        }

        .skill-no {
          color: #ef4444;
        }

        .footer {
          background: #f8fafc;
          padding: 20px 30px;
          text-align: center;
          color: #666;
          border-top: 1px solid #e2e8f0;
        }
        
        @media print {
          body { background: white; }
          .container { box-shadow: none; }
        }

        @media (max-width: 600px) {
          .language-skills {
            flex-direction: column;
            gap: 10px;
          }
          
          .skill-item {
            flex-direction: row;
            justify-content: flex-start;
            min-width: auto;
          }
          
          .skill-icon {
            margin-bottom: 0;
            margin-right: 10px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="profile-photo">
            ${candidate?.canditate_photo ? `<img src="${candidate.canditate_photo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />` : "👤"}
          </div>
          <h1>${candidate?.canditate_name || "Candidate Name"}</h1>
          <div class="subtitle">${candidate?.job_title || "Job Title"}</div>
        </div>
        
        <div class="content">
          <!-- Personal Information -->
          <div class="section">
            <div class="section-title">
              <span class="section-icon">🧑</span>
              <h2>Personal Information</h2>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Full Name</div>
                <div class="info-value">${candidate?.canditate_name || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Age</div>
                <div class="info-value">${candidate?.canditate_age || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Gender</div>
                <div class="info-value">${candidate?.jobseeker_gender || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Marital Status</div>
                <div class="info-value">${candidate?.canditate_marital_status || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Location</div>
                <div class="info-value">${candidate?.jobseeker_yourcity || "N/A"}, ${candidate?.jobseeker_yourstate || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Registration Type</div>
                <div class="info-value">${candidate?.registration_type || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Religion</div>
                <div class="info-value">${candidate?.jobseeker_religion || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Ethnicity</div>
                <div class="info-value">${candidate?.jobseeker_ethnicity || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Height</div>
                <div class="info-value">${candidate?.jobseeker_height || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Weight</div>
                <div class="info-value">${candidate?.jobseeker_weight || "N/A"}</div>
              </div>
            </div>
          </div>

          <!-- Language Skills Section -->
          <div class="section">
            <div class="section-title">
              <span class="section-icon">🌐</span>
              <h2>Language Skills</h2>
            </div>
            <div class="languages-section">
              ${formatLanguageSkills(candidate?.jobseeker_languages)}
            </div>
          </div>
          
          <!-- Job Information -->
          <div class="section">
            <div class="section-title">
              <span class="section-icon">💼</span>
              <h2>Job Information</h2>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Job Type</div>
                <div class="info-value">${candidate?.job_type || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Experience</div>
                <div class="info-value">${candidate?.canditate_experience || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Expected Salary</div>
                <div class="info-value">${candidate?.canditate_currency || ""} ${candidate?.canditate_salary || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Skills</div>
                <div class="info-value">${candidate?.jobseeker_skills?.jobseeker_skills || "N/A"}</div>
              </div>
            </div>
          </div>
          
          <!-- Experience Information -->
          <div class="section">
            <div class="section-title">
              <span class="section-icon">📊</span>
              <h2>Experience Information</h2>
            </div>
            ${formatExperienceDetails(candidate?.experience_details)}
          </div>
          
          <!-- Visa & Travel Information -->
          <div class="section">
            <div class="section-title">
              <span class="section-icon">🛂</span>
              <h2>Visa & Travel Information</h2>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Passport</div>
                <div class="info-value">${candidate?.jobseeker_passport || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Visa Type</div>
                <div class="info-value">${candidate?.jobseeker_visa_type || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Visa Expiry Date</div>
                <div class="info-value">${candidate?.jobseeker_visa_expiry_date || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Available From</div>
                <div class="info-value">${candidate?.jobseeker_visa_Available_from || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Ready to Work Country</div>
                <div class="info-value">${candidate?.jobseeker_ready_to_work_Country || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Ready to Work State</div>
                <div class="info-value">${candidate?.jobseeker_ready_to_work_State || "N/A"}</div>
              </div>
            </div>
          </div>
          
          <!-- Documentation -->
          <div class="section">
            <div class="section-title">
              <span class="section-icon">📑</span>
              <h2>Documentation</h2>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Education</div>
                <div class="info-value">${candidate?.jobseeker_education || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Address Proof</div>
                <div class="info-value">${candidate?.jobseeker_addressproof || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">ID Proof</div>
                <div class="info-value">${candidate?.jobseeker_idproof || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">PCC</div>
                <div class="info-value">${candidate?.jobseeker_pcc || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} | Lassie HR Solutions Pvt. Ltd. </p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  const generatePDF = async () => {
    try {
      const html = generateHTML()
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      })
      return uri
    } catch (error) {
      console.error("Error generating PDF:", error)
      throw error
    }
  }

  const sharePDF = async () => {
    try {
      const pdfUri = await generatePDF()
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri, {
          mimeType: "application/pdf",
          dialogTitle: "Share Candidate Profile",
          UTI: "com.adobe.pdf",
        })
      } else {
        Alert.alert("Sharing not available", "Sharing is not available on this device")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate or share PDF")
      console.error("Error sharing PDF:", error)
    }
  }

  const downloadPDF = async () => {
    try {
      const pdfUri = await generatePDF()
      const fileName = `${candidate?.canditate_name || "candidate"}_profile_${Date.now()}.pdf`
      const downloadPath = `${FileSystem.documentDirectory}${fileName}`
      await FileSystem.moveAsync({
        from: pdfUri,
        to: downloadPath,
      })
      Alert.alert("Success", `PDF saved to: ${downloadPath}`, [
        { text: "OK" },
        { text: "Share", onPress: () => Sharing.shareAsync(downloadPath) },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to download PDF")
      console.error("Error downloading PDF:", error)
    }
  }

  useImperativeHandle(ref, () => ({
    sharePDF,
    downloadPDF,
  }))

  return null
})

PDFGenerator.displayName = "PDFGenerator"

export default PDFGenerator
export type { PDFGeneratorRef }

