import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
// import './App.css';
import { pascalStrToSpacedWord } from "./helper.js";
import FormComponent from "./FormComponent.jsx";

function Form({ LicenseData = false }) {
  const [token, setToken] = useState(null);
  const [schema, setSchema] = useState(null);
  const [schemaLink, setClaimLink] = useState(null);

  useEffect(() => {
    fetch("https://api-staging.polygonid.com/v1/orgs/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
      },
      body: JSON.stringify({
        email: "samyakjainking@gmail.com",
        password: "Saakshi@123",
      }),
    })
      .then((response) => response.json())
      .then(({ token }) => {
        setToken(token);
        const {
          account: { organization: issuerId },
        } = jwt_decode(token);
        console.log(issuerId);
        const tempSchemaLink = `https://api-staging.polygonid.com/v1/issuers/${issuerId}/schemas/482f65b2-58d7-4cac-a965-f0ccb20753d9`;
        setClaimLink(`${tempSchemaLink}/offers`);
        console.log(tempSchemaLink);
        return { token, tempSchemaLink };
      })
      .then(({ token, tempSchemaLink }) => {
        fetch(tempSchemaLink, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setSchema(data));
      });
  }, []);

  const handleResults = (results) => {
    fetch(schemaLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attributes: Object.keys(results).map((k) => {
          const removeDashes = results[k].indexOf("-") !== 0;
          const val = removeDashes
            ? results[k].replaceAll("-", "")
            : results[k];
          return {
            attributeKey: k,
            attributeValue: parseInt(val),
          };
        }),
      }),
    })
      .then((response) => response.json())
      .then(({ id }) => {
        window.open(
          `https://platform-test.polygonid.com/claim-link/${id}`,
          "_newtab"
        );
      });
  };

  return !!schema ? (
    <>
      <div w="xl" p={10} background="rgba(255,255,255,.90)">
        <h1 mb={5}>Create airdrop</h1>
        <FormComponent
          LicenseData={LicenseData}
          fieldInfo={schema?.attributes}
          passBackResults={handleResults}
        />
      </div>
    </>
  ) : (
    <div>loding</div>
  );
}

export default Form;
