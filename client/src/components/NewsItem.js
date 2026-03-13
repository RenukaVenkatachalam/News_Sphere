import React from 'react'

const NewsItem = ({title, description,image,url}) => {
  return (
    <div className="grid" onClick={() => window.open(url, '_blank')} style={{
        border:'1px solid orange',
        padding:'10px',
        cursor: 'pointer'
    }

    }>
        <img src={image || "https://dummyimage.com/300X180/000/fff"} alt="news" style={{width:'100%', height:'180px',objectFit:'cover'}}
        /> 
        <h4>{title}</h4>
        <p>{description || 'No description for this news item'}</p>
    </div>
  )
}

export default NewsItem