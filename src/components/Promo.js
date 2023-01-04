function Promo(props) {
  const headingStyle = {
    color: "red",
    fontSize: "50px",
  };

  const subheadingStyle = {
    color: "blue",
    fontSize: "20px",
    backgroundColor: "#f5f5f5",
    padding: "1rem",
    borderRadius: "5px",
    marginBottom: "1rem",
    border: "1px solid rgb(0, 0, 0)",
  };

  return (
    <div className="promo-section">
      <div>
        <h1 style={headingStyle}>{props.heading}</h1>
      </div>
      <div>
        <h2 style={subheadingStyle}>{props.promoSubHeading}</h2>
      </div>
    </div>
  );
}

export default Promo;
