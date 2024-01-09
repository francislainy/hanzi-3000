import './Banner.css';

function Banner({title, description, buttonText, handleStartGame}) {
    return (
        <div className="banner">
            <h1 className='banner__title'>{title}</h1>
            <p className='banner__description'>{description}</p>
            <button className='banner__start-button' onClick={() => handleStartGame()}>{buttonText}</button>
        </div>
    )
}

export default Banner;