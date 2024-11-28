import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import '../styles/MasterFooter.css'
import { Transition } from 'react-transition-group';


function MainFooter() {
    return (
        <div className="mf-main-container">
            <div className="mf-sub-container">
                <p>©2024 writeguidekr.com </p>
                <Link to="/privacy"  style={{ textDecoration: "none", color: "black"}}>
                    <p button className="mf-title-button">개인정보취급방침</p>
                </Link>
            </div>
        </div>
    );
}

export default MainFooter;