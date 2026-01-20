import { CountryPicker, DateTimePicker, Dropdown, Input } from "../common";

const PassengerDetailInputGroup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentType, setDocumentType] = useState("passport");

  return (
    <>
      <Input
        label="First Name"
        placeholder="Enter your first name"
        value={firstName}
        onChange={setFirstName}
      />
      <Input
        label="Last Name"
        placeholder="Enter your last name"
        value={lastName}
        onChange={setLastName}
      />

      <DateTimePicker mode="date" label="Date of Birth" value={dateOfBirth} />

      <Dropdown
        label="Gender"
        items={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
        value={gender}
      />

      <Input
        label="Email"
        placeholder="jhondoe@example.com"
        value={email}
        onChange={setEmail}
      />
      <Input
        label="Phone"
        placeholder="+1234567890"
        value={phone}
        onChange={setPhone}
      />

      <Dropdown
        label="Document Type"
        items={[
          { label: "PASSPORT", value: "passport" },
          { label: "IDENTITY CARD", value: "identity_card" },
          { label: "VISA", value: "visa" },
          { label: "KNOWN TRAVELER", value: "known_traveler" },
          { label: "REDRESS", value: "redress" },
        ]}
        value={documentType}
      />

      <Input label="Birth Place" placeholder="e,g Madrid" />
      <Input label="Issuance Location" placeholder="e,g Madrid" />
      <DateTimePicker mode="date" label="Issuance Date" value={new Date()} />
      <Input label="Number" placeholder="1234567890" />
      <DateTimePicker mode="date" label="Expiry Date" value={new Date()} />
      <CountryPicker label="Issurance Country" />
      <CountryPicker label="Validity Country" />
      <CountryPicker label="Nationality" />
    </>
  );
};

export default PassengerDetailInputGroup;
