import React from 'react'

export interface InfoCardProp {
    type: string, 
    title: string
}


const InfoCard = ({ title, type = "vertical" } : InfoCardProp) => {

    return (
    <div className={`info-card info-card-${type}`}> 
        <div className='image-container'>
            <img src="https://thisis-images.spotifycdn.com/37i9dQZF1DZ06evO3q11Ek-default.jpg" alt="" />
        </div>
        <span>{title}</span>
        {/* add a "description" element based if the song/album has a condition */}
    </div>
    )
}

export default InfoCard