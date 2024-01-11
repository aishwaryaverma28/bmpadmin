import React from 'react';
import '../styles/CPGenral.css';
import Pound from "../../assets/image/british-pound-symbol.svg";

const CurrencyTab = () => {
    return (
        <section>
            <div className='currency-btn'>
                <button className='common-save-button'>Add currency</button>
            </div>


            <div className='currency-tab-table'>
                <table>
                    <thead>
                        <tr>
                            <th className='common-fonts'>Name</th>
                            <th className='common-fonts'>Format</th>
                            <th className='common-fonts'>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className='common-fonts'><span className='currency-tab-dollar'>Great Britain Pound (GBP) <img src={Pound} alt="" className='pound' /> </span > <span className="currency-tab-default">Default Currency</span></td>
                            <td>$ 123,456.78</td>
                            <td>
                                <div>
                                    <label className="password-switch">
                                        <input type="checkbox" checked />
                                        <span className="password-slider password-round"></span>
                                    </label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className='common-fonts'><span className='currency-tab-dollar'>US dollars (USD) $</span ></td>
                            <td>$ 123,456.78</td>
                            <td>
                                <div>
                                    <label className="password-switch">
                                        <input type="checkbox" />
                                        <span className="password-slider password-round"></span>
                                    </label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className='common-fonts'><span className='currency-tab-dollar'>indian rupee (INR) Rs</span ></td>
                            <td>$ 123,456.78</td>
                            <td>
                                <div>
                                    <label className="password-switch">
                                        <input type="checkbox" />
                                        <span className="password-slider password-round"></span>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </section>
    )
}

export default CurrencyTab