import { checkbox } from "./CheckboxList";
import { MultiCheckboxItem } from "./Multiselectlist";
import { RadioOption } from "./RadioButton";

export interface ProfileData {
    profileImage: string;
    logo: string | null;
    companyName: string;
    companyAddress: string;
    yearEstablished: string;
    experience: string;
    gstNumber: string;
    certificate: string | null;
    replacementPolicy: string;
    refundPolicy: string;
    businessInfo: string;
  }

type UserType = 'Agency' | 'Individual' | 'Admin'; // Add other possible user types
  export interface UserData {
  error: boolean;
  user_id: string;
  user_type: "Agency" | string; // Assuming other types might exist
  username: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  nationality: string;
  company_name: string;
  company_Address: string;
  company_reg_no: string; // Empty string in example
  company_gst_no: string;
  company_pan_no: string;
  company_website: string; // Empty string in example
  company_services: string; // Empty string in example
  experience: string; // Could be number if you prefer
  number_of_maids: string; // Empty string in example
  commission_registration_charges: string; // Empty string in example
  replacement_policy: string;
  refund_policy: string; // Empty string in example
  business_Information: string; // Empty string in example
  profile_photo: string; 
  company_logo? : string;
  year_of_establishment?: string;
  agency_certificate?:string;
}

export interface ICandidate {
  canditate_age: string;
  canditate_currency: string;
  canditate_experience: string;
  canditate_id: string;
  canditate_location: string;
  canditate_marital_status: string;
  canditate_name: string;
  canditate_phone: string;
  canditate_photo: string; // Base64 encoded image
  canditate_salary: string;
  job_title: string;
  job_type: string;
  registration_type: string;
  iswishlisted : boolean;
  jobseeker_yourcountry: string;
  jobseeker_yourstate: string;
  jobseeker_yourcity : string;
}

export interface CandidateFilter {
  registration_type?: 'All' | 'Self' | 'By Agency';
  job_type?: string;
  jobseeker_ethnicity?: string;
  jobseeker_skills?: string;
  jobseeker_gender?: string;
  jobseeker_passport?: 'Yes' | 'No';
  jobseeker_yourcity?: string;
  jobseeker_yourstate?: string;
  jobseeker_yourcountry?: string;
}

export interface JobListing{
  employer_job_posting_time: string
  job_category: string
  job_id: string
  job_posting_budget_for_hiring: string
  job_posting_city: string
  job_posting_country: string
  job_posting_currency: string
  job_posting_gender_preference: string
  job_posting_locality: string
  job_posting_number_of_members: string
  job_posting_salary: string
  job_posting_state: string
  job_posting_urgent_is: string
  job_title: string
  job_type: string
  salary: string
  experience: string
}

export interface MaidProfiles {
  category_id: string;
  category_name: string;
  no_of_profile: number;
  category_icon: string
}

export interface Country {
  country_id: string;
  country_name: string;
  country_code: string ;
}

export interface StateList {
  job_posting_state_id: string;
  job_posting_state: string;
}

export interface CityList{
  job_posting_city_id: string
  job_posting_city: string
}

export interface Religion {
  religions_name: string;
  religions_id: string;
}

export interface AddressType {
  addressproofs_name: string
  addressproofs_id: string
}

export interface IDProofType {
  idproof_name: string
  idproof_id: string
}

export interface Experiance{
  experience_name: string
  experience_id: string
}

export interface Weight {
  weights_name: string;
  weights_id: string;
}

export interface Height{
  heights_name: string
  heights_id: string
}

export interface Ethnicity{
  livingarrangements_name:string
  livingarrangements_id: string
}

export interface Language{
  language_name: string
  language_id: string
}

export interface salaryList{
  salaryexpecteds_name: string
  salaryexpecteds_id: string
}

export interface CountryCurrency {
  currency_id: string;
  country_name: string;
  currency: string;
  currency_name: string;
  currency_code: string;
}

export interface TypeOfVisa {
  typeofvisa_name: String
  typeofvisa_id: String
}

export interface JobTypes {
  jobtype_name: string;
  jobtype_id: string;
  checked: boolean ;
}

export interface JobTitles {
  jobtitle_name: string;
  jobtitle_id: string;
  checked: boolean ;
}

export interface Skills {
  skill_name: string;
  skill_id: string;
  checked: boolean ;
}

export interface AddCandidateFormLists{
  countryList: checkbox[];
  yourCountryList: checkbox[];
  ethnicityList: checkbox[];
  maritalStatus: RadioOption[];
  religionList: checkbox[];
  heightList: checkbox[];
  weightList: checkbox[];
  stateList: checkbox[];
  cityList : checkbox[];
  jobTitleList: checkbox[];
  jobTypeList: checkbox[];
  expectedSalaryList: checkbox[];
  currencyList: checkbox[];
  readyToWorkCountryList: checkbox[];
  languagelist: checkbox[];
  skillList: MultiCheckboxItem[];
  selectedSkills: MultiCheckboxItem[];
  typeOfVisaList: checkbox[];
  addressTypeList: checkbox[];
  idProofTypeList: checkbox[];
}

export interface Order {
  mobile: string;
  email: string;
  address: string;
  name: string;
  looking_for: string;
  service_required: string;
  servant_quarter: string;
  hiring_budget: string;
  number_of_member: string;
  description: string;
}

export interface ServiceDelivery {
  form_no: number;
  order_id: string;
  cname: string;               // Customer name
  cmobile: string;             // Customer mobile
  cdocument: string;           // Customer document ID
  c_verified: "Verified" | "Unverified" | string;  // Verification status
  ename: string;               // Employee/executive name
  emoble: string;              // Employee mobile
  e_verified: "Verified" | "Unverified" | string;  // Employee verification status
}

export interface ServiceDeliveryDetails {
  order_id: string;
  form_no: string;
  // Customer Information
  cname: string;               // Customer name
  cmobile: string;             // Customer mobile number
  cdocument: string;           // Customer document ID
  cfamily: string;             // Family member name
  caddress: string;            // Customer address

  // Employment Details
  esalary: string;             // Employee salary (string to preserve exact format)
  ejoindate: string;           // Join date (YYYY-MM-DD format)
  ejobcategory: string;        // Job category/type

  // Financial Information
  registrationcharge: string;   // Registration fee
  transportcharge: string;      // Transportation charges
  consultantcharges: string;    // Consultant fees

  // Employee/Agent Information
  ename: string;               // Employee/agent name
  emoble: string;              // Employee/agent mobile
  address: string;             // Employee/agent address
}

export interface Agreement {
  form_no: number;
  order_id: string;
  cname: string;              
  cmobile: string;       
  ename: string;            
  emoble: string;            
  consulting_charge: string; 
  pay_type: "online transfer" | "cash" | "cheque" | string;
  agr_date: string;    
}


export interface IFormData { // 44
  first_name: string;
  last_name: string;
  mobile_number: string;
  gender: string;
  marital_status: string;
  dob: string; 
  age: string; 
  jobseeker_nationality: string;
  country_code: string
  jobseeker_ethnicity: string;
  religion: string;
  height: string; 
  weight: string;
  jobseeker_yourcountry: string;
  jobseeker_yourstate: string;
  jobseeker_yourcity : string;
  job_title: string;
  job_type: string;
  jobseeker_currency: string;
  salary_expected: string;
  jobseeker_ready_to_work_Country: string;
  jobseeker_ready_to_work_State: string;
  jobseeker_ready_to_work_City: string;
  jobseeker_ready_to_work_Locality: string;
  jobseeker_available: string;
  jobseeker_education: string;
  skill: {};
  jobseeker_passport: string;
  type_of_visa: string;
  jobseeker_visa_expiry_date: string;
  jobseeker_visa_Available_from: string;
  languages: string;
  jobseeker_pcc: string;
  jobseeker_verification_doc: string;
  jobseeker_doc_impre: string;
  jobseeker_addressproof: string;
  jobseeker_idproof: string;
  experience: string;
  experience_Job_title: string;
  experience_Location: string;
  experience_Salary: string;
  experience_From_To: string;
  experience_Nature_of_Work: string;
  experience_Reason_for_leaving: string;
  reference_name: string;
  reference_mobile: string;
  reference_relationship: string;
  reference_any_id_number: string;
}

export interface CandidateDocuments {
  canditate_image: string;
  id_proof_image: string; 
  address_proof_image: string;
}

export interface AddDeliveryNotes {
  ciof_no: string;
  canditate_name: string;
  canditate_mobile: string;
  canditate_family: string;
  canditate_address: string;
  canditate_document_no: string;
  esalary: string;
  ejoindate: string;
  ejobcategory: string;
  // ejobtype : string;
  registrationcharge: string;
  transportcharge: string;
  consultantcharges: string;
}

export interface DNEmployerData {
  name: string;
  mobile: string;
  address: string;
}

export interface Package {
  package_id: string;
  package_title: string;
  package_amount: string;
  package_amount_usd: string;
  package_valid_days: string;
  package_contact_allow: string; 
  package_description: string;
}

export interface AgreementData {
  order_id: string;
  cname: string;
  cmobile: string;
  caddress: string;
  ename: string;
  emoble: string;
  address: string;
  esalary: string;
  ejoindate: string;
  ejobcategory: string;
  registrationcharge: string;
  transportcharge: string;
  consultantcharges: string;
}

export interface AgreementFormData {
  form_id: string;
  food: string;
  living: string;
  working_hour: string;
  free_replacment: string;  // Note: Typo in "replacment" (should be "replacement")
  agr_validity: string;     // Note: Short for "agreement_validity"?
  consulting_charge: string;
  pay_type: string;
  month_deduction: string;  // Note: "deduction" or "deductions"?
  place: string;
}

export interface AgreementDetails {
  order_id: string;
  canditate_name: string;
  canditate_mobile: string;
  canditate_address: string;
  employer_name: string;
  employer_moble: string; // Note: Typo in field name (should be employer_mobile?)
  employer_address: string;
  employer_salary: string;
  employer_ejobcategory: string;
  employer_registrationcharge: string;
  employer_joindate: string; // Consider using Date type if you'll parse it
  employer_working_hour: string;
  free_replacment: string; // Note: Typo in field name (should be free_replacement?)
  aggrement_validity: string; // Note: Typo in field name (should be agreement_validity?)
  registration_charge: string;
  transport_charge: string;
  consulting_charge: string;
  month_deduction: string;
  pay_type: string;
  place: string;
  food: string; // Could be boolean or number (1/0)
  living: string; // Could be boolean or number (1/0)
  looking_for: string[] | string; // Array if parsed from JSON string
}

export interface JobSeeker {
  canditate_photo: string;
  registration_type: string;
  canditate_name: string;
  job_title: string;
  job_type: string;
  canditate_location: string;
  canditate_salary: string;
  canditate_experience: string;
  canditate_marital_status: string;
  canditate_currency: string;
  canditate_age: string;
  jobseeker_ethnicity: string;
  jobseeker_skills: string;
  jobseeker_gender: string; 
  jobseeker_passport: string;
  jobseeker_yourcity: string;
  jobseeker_yourstate: string;
  jobseeker_yourcountry: string;
  iswishlisted: boolean;
}

export interface EmployerDetails {
  employer_id: string;
  employer_name: string | null;
  employer_number: string | null;
  employer_address: string | null;
  employer_message: string | null;
  job_id: string;
  job_title: string;
  job_category: string;
  job_type: string;
  job_posting_country: string;
  job_posting_state: string;
  job_posting_city: string;
  job_posting_locality: string;
  job_posting_budget_for_hiring: string;
  job_posting_salary: string;
  job_posting_currency: string;
  job_posting_gender_preference: string;
  job_posting_number_of_members: string;
  job_posting_urgent_is: string;
  employer_job_posting_time: string;
}
