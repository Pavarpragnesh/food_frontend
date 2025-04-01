import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Terms.css";

const Terms = ({ url = "http://localhost:5001" }) => {
  const [termsList, setTermsList] = useState([]);

  // Fetch all terms
  const fetchTerms = async () => {
    try {
      const response = await axios.get(`${url}/api/terms/list`);
      if (response.data.success) {
        // Filter terms to only include those with title "delivery boy"
        const filteredTerms = response.data.data.filter(
          (term) => term.title === "user"
        );
        setTermsList(filteredTerms);
      } else {
        toast.error("Error fetching terms");
      }
    } catch (error) {
      toast.error("Error fetching terms");
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <div className="db-terms-container">
      <h1>Users Terms and Conditions</h1>
      {termsList.length === 0 ? (
        <p>No terms and conditions available for Users.</p>
      ) : (
        termsList.map((term, index) => (
          <div key={term._id} className="terms-section">
            <h2>{term.subtitle}</h2> {/* Display the title */}
            <div className="terms-item">
              <p>
                {/* <strong>{term.subtitle}</strong> Display the subtitle */}
              </p>
              {term.descriptions?.map((desc, i) => (
                <p key={i}>
                  {i + 1}. {desc} {/* Display each description with numbering */}
                </p>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Terms;