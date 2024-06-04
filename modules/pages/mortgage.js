async function mortgageCalculator(
  loanAmount,
  interestRate,
  loanTerm,
  res,
  req
) {
  const url = `https://mortgage-monthly-payment-calculator.p.rapidapi.com/revotek-finance/mortgage/monthly-payment?loanAmount=${loanAmount}&interestRate=${interestRate}&terms=${loanTerm}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "f95fc45562mshcc33e4d849faedbp1b1b6fjsn479bdf772659",
      "X-RapidAPI-Host": "mortgage-monthly-payment-calculator.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const { monthlyPayment } = await response.json();
      res.render("mortgage", { monthlyPayment, user: req.user });
      console.log(monthlyPayment);
    } else {
      throw new Error(
        `Failed to calculate monthly payment! Status: ${response.status}`
      );
    }
  } catch (error) {
    console.error(error);
    res.render("mortgage", {
      error: "Failed to calculate monthly payment",
      user: req.user,
    });
  }
}

module.exports = mortgageCalculator;
