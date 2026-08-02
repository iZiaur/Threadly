import React, { useContext } from 'react';
import './FlashMessage.css';
import { ShopContext } from '../../Context/ShopContext';

function FlashMessage() {
    const { serverDown, cartMessage } = useContext(ShopContext);

    return (
        <>
            {serverDown && (
                <div className="flash-message error">
                    <p>Backend Server is currently down or unreachable. Some features may not work.</p>
                </div>
            )}
            {cartMessage && (
                <div className="flash-message success">
                    <p>{cartMessage}</p>
                </div>
            )}
        </>
    );
}

export default FlashMessage;
