
import React, { useState } from 'react';
import "../styles/LPSettingsNotification.css";
import ArrowGreater from "../../assets/image/greater-arrow.svg";
import SearchIcon from "../../assets/image/search.svg";
import GreaterArrowDown from "../../assets/image/greater-arrow-down.svg";
// import GreaterArrowDown from "../assets/image/arrow-down.svg";

export default function LPNotificationContent() {
  const [activeSection, setActiveSection] = useState(null);
  const toggleSection = (sectionKey) => {
    setActiveSection((prevSection) => (prevSection === sectionKey ? null : sectionKey));
  };

  const isSectionActive = (sectionKey) => activeSection === sectionKey;

  const sectionData = [
    {
      key: 'calling',
      title: 'Calling',
      content: [
        { heading: 'Missed Calls', note: 'Get notified when a call has been missed' },
        // Add other calling section content here
      ],
    },
    {
      key: 'deals',
      title: 'Deals',
      content: [
        { heading: 'Deal assigned to you', note: 'Get notified when a deal is assigned to you' },
        {heading: 'Deal stage update', note: 'Get notified when a deal you own or follow moves to a new stage.'},
        {heading: 'You’re mentioned on a deal record' , note: 'Get notified when a teammate @mentions you in a note or logged activity on a deal record.'}
        //                        
        
      ],
    },
    {
      key: 'leads',
      title: 'Leads',
      content: [
        { heading: 'Lead assigned to you', note: 'Get notified when a lead is assigned to you' },
        { heading: 'Lead stage update', note: 'Get notified when a deal you own or follow moves to a new stage.' },
        { heading: 'You’re mentioned on a lead record', note: 'Get notified when a teammate @mentions you in a note or logged activity on a deal record.' },
        
      ],
    },
    {
      key: 'activity',
      title: 'Activity',
      content: [
        { heading: 'Activity created & assigned to you', note: 'Get notified when a activity is assigned to you' }
      ],
    },
    {
      key: 'comments',
      title: 'Comments',
      content: [
        { heading: 'Mention in comments', note: 'When a team member comments on a note you own or where you have left comments.' }
      ],
    },
    {
      key: 'mentions',
      title: 'comments & Mentions',
      content: [
        { heading: 'Mention in comments', note: 'Get notified when a team member comments on a note you own or where you have left comments.' }
      ],
    },
    {
      key: 'assign',
      title: 'Assigned to you',
      content: [
        { heading: 'Chat conversation assigned to you', note: 'Get notified when a new live chat, bot, Facebook Messenger, or WhatsApp conversation is assigned to you.' },
        { heading: 'Chat conversation reassigned to you', note: 'Get notified when a chat, Facebook Messenger, or WhatsApp conversation is reassigned to you. Note: Bots only notify at the point of handoff.'},
        { heading: 'Email conversation assigned to you', note: 'Get notified when an email conversation is assigned to you.'},
        { heading: 'Email conversation reassigned to you', note: 'Get notified when an email conversation is reassigned to you.'}
      ]
    },
    {
      key: 'contacts',
      title: 'Contacts & Companies',
      content: [
        { heading: 'Company assigned to you', note: 'Get notified when a company is assigned to you' },
        { heading: 'Contact assigned to you', note: 'Get notified when a contact is assigned to you'},
        { heading: 'You’re mentioned on a company record', note: 'Get notified when a teammate @mentions you in a note or logged activity on a company record.'},
        { heading: 'You’re mentioned on a contact record', note: 'Get notified when a teammate @mentions you in a note or logged activity on a contact '}
      ]
      
    },

    {
      key: 'invoice',
      title: 'Invoice',
      content: [
        { heading: 'Invoice Paid', note: 'Get notified when a team member comments on a note you own or where you have left comments.' }
      ],
    }
    
  ];

  return (
    <div className="notification-list-section notification-setting-fonts">
      <p className="notify-me-about">Notify me about</p>

      <div className="search-user-section">
        <div className="search-box">
          <input
            type="text"
            className="search-input notification-setting-fonts"
            placeholder="Search for notification topics"
          />
          <span className="search-icon">
            <img src={SearchIcon} alt="" />
          </span>
        </div>
      </div>

      <div className="notification-list">
        <ul>
          {sectionData.map((section) => (

            <li key={section.key}>
              <div className="notification-list-table">
                <div className="notification-display" onClick={() => toggleSection(section.key)}>
                  <div className="notification-img">
                    <img src={isSectionActive(section.key) ? GreaterArrowDown : ArrowGreater} alt="" className="arrow-img" />
                  </div>
                  <div>
                    <span className="notification-list-name">{section.title}</span>
                  </div>
                </div>

                <table className="notification-table" id="notification-border" style={{ display: isSectionActive(section.key) ? 'table' : 'none' }}>
                  <thead>
                    {
                                  section.key!=="invoice" && (
                                    <tr>
                                    <th>
                                      <label className="custom-checkbox">
                                        <input type="checkbox" className="cb1" />
                                        <span className="checkmark"></span>
                                      </label>
                                    </th>
                                    <th></th>
                                  </tr>

                                  )
                               
                    }
 
                  </thead>
                  <tbody>
                    {section.content.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <label className="custom-checkbox">
                            <input type="checkbox" className="cb1" />
                            <span className="checkmark"></span>
                          </label>
                        </td>
                        <td>
                          <div className="notification-list-details">
                            <p className="notify-heading">{item.heading}</p>
                            <p className="notify-note">{item.note}</p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
