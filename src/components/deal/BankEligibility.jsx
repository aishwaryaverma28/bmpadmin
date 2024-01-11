import React, { useState } from 'react'
import GreaterDown from "../../assets/image/greater-arrow-down.svg";
import GreaterUp from "../../assets/image/greater-up.svg";
const BankEligibility = ({ onClose, loan }) => {
  console.log(loan);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleTicket = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };


  return (
    <div className="help-modal-container">
      <div className="help-modal-box">
        <div className="create-lead-top">
          <p>All Banks Criteria</p>
        </div>
        <div className="time-container">
          {loan.map((item, index) => (
            <div className="time-box" key={index}>
              <div>
                <div>
                  {openIndex !== index && (
                    <div className="time-ticket-top-2">
                      <p className="common-fonts bankName"> {item?.loan_offered_by}</p>
                      <div className="ticket-img" onClick={() => toggleTicket(index)}>
                        <img src={GreaterDown} alt="" />
                      </div>
                    </div>
                  )}
                </div>
                {
                  openIndex === index && (
                    <>
                      <div className="time-ticket-top-2">
                        <p className="common-fonts bankName"> {item?.loan_offered_by}</p>
                        <div className="ticket-img" onClick={() => toggleTicket(index)}>
                          <img src={GreaterUp} alt="" />
                        </div>
                      </div>
                      <div className='bankDetails'>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>Age of Buisness : </strong>{item.age_of_business}</p>
                        </div>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>Credit Score : </strong>{item.credit_score}</p>
                        </div>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>Company Type : </strong>{item.company_type}</p>
                        </div>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>Duration : </strong>{item.duration}</p>
                        </div>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>individual / Company : </strong>{item.individual_or_company}</p>
                        </div>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>Industry Type : </strong>{item.industry_type}</p>
                        </div>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>Loan Amount : </strong>{item.loan_amount}</p>
                        </div>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>Loan Type : </strong>{item.loan_type}</p>
                        </div>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>Location of Comapny : </strong>{item.location_of_company}</p>
                        </div>
                        <div className='detailsRow'>
                          <p className='detailesLine'> <strong>Turnover : </strong>{item.turnover}</p>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div >
      <div className="help-cross" onClick={onClose}>
        X
      </div>
    </div >
  );
}

export default BankEligibility;