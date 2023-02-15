import React from "react";
import {
  getContract,
  getAllLicences,
  getUserDetails,
  registerUser,
} from "../utilities/contractfunctions.js";
const NewMediaForm = () => {
  const [userDetails, setUserDetails] = React.useState({});
  const [allLicences, setAllLicences] = React.useState([]);
  const [contract, setContract] = React.useState({});
  const [newMedia, setNewMedia] = React.useState({
    title: "",
    description: "",
    licence: "",
    price: "",
    file: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  React.useEffect(() => {
    const init = async () => {
      const contract = await getContract();
      const allLicences = await getAllLicences(contract);
      const userDetails = await getUserDetails(contract);
      console.log(contract, allLicences, userDetails);
      setContract(contract);
      setAllLicences(allLicences);
      setUserDetails(userDetails);
    };
    init();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMedia((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { title, description, licence, price, file } = newMedia;
      const { address } = userDetails;
      const { contract } = contract;
      const result = await registerUser(
        contract,
        title,
        description,
        licence,
        price,
        file,
        address
      );
      console.log(result);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(true);
    }
    setLoading(false);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className=" mt-10">
      <h1>Register New Media</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={newMedia.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            value={newMedia.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="licence">Licence</label>
          <select
            name="licence"
            id="licence"
            value={newMedia.licence}
            onChange={handleChange}
          >
            <option value="">Select Licence</option>
            {allLicences.map((licence) => (
              <option key={licence.id} value={licence.id}>
                {licence.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            id="price"
            value={newMedia.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="file">File</label>
          <input
            type="file"
            name="file"
            id="file"
            value={newMedia.file}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <div>Something went wrong</div>}
      {success && <div>Media Registered Successfully</div>}
    </div>
  );
};

export default NewMediaForm;
