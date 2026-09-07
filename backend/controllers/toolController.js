// KKN TRADER - Financial Trading Calculators Controller
// Server-side validation and computation for trading calculators

const calculatePositionSize = (req, res) => {
  const { accountBalance, riskPercent, stopLossPips, pipValue = 10 } = req.body;

  if (!accountBalance || !riskPercent || !stopLossPips) {
    return res.status(400).json({ success: false, message: 'Please provide accountBalance, riskPercent, and stopLossPips.' });
  }

  const riskAmount = (accountBalance * (riskPercent / 100));
  const lots = (riskAmount / (stopLossPips * pipValue));

  res.status(200).json({
    success: true,
    data: {
      accountBalance: Number(accountBalance),
      riskPercent: Number(riskPercent),
      riskAmount: Number(riskAmount.toFixed(2)),
      stopLossPips: Number(stopLossPips),
      recommendedLotSize: Number(lots.toFixed(2)),
      standardLots: Number(lots.toFixed(2)),
      miniLots: Number((lots * 10).toFixed(1)),
      microLots: Number((lots * 100).toFixed(0)),
    },
  });
};

const calculateRiskReward = (req, res) => {
  const { entryPrice, stopLoss, takeProfit, lotSize = 1.0, side = 'BUY' } = req.body;

  if (!entryPrice || !stopLoss || !takeProfit) {
    return res.status(400).json({ success: false, message: 'Please provide entryPrice, stopLoss, and takeProfit.' });
  }

  const entry = parseFloat(entryPrice);
  const sl = parseFloat(stopLoss);
  const tp = parseFloat(takeProfit);
  const lots = parseFloat(lotSize);

  const riskDistance = Math.abs(entry - sl);
  const rewardDistance = Math.abs(tp - entry);

  if (riskDistance === 0) {
    return res.status(400).json({ success: false, message: 'Stop Loss cannot be identical to Entry Price.' });
  }

  const ratio = Number((rewardDistance / riskDistance).toFixed(2));
  const estimatedRiskUSD = Number((riskDistance * lots * 100000).toFixed(2));
  const estimatedRewardUSD = Number((rewardDistance * lots * 100000).toFixed(2));

  res.status(200).json({
    success: true,
    data: {
      side,
      entryPrice: entry,
      stopLoss: sl,
      takeProfit: tp,
      riskDistance,
      rewardDistance,
      riskRewardRatio: `1:${ratio}`,
      numericRatio: ratio,
      estimatedRiskUSD,
      estimatedRewardUSD,
      isAcceptableInstitutionalRatio: ratio >= 2.0,
    },
  });
};

const calculateCompounding = (req, res) => {
  const { initialBalance = 10000, monthlyReturnPercent = 5, months = 12, monthlyDeposit = 0 } = req.body;

  let balance = parseFloat(initialBalance);
  const returnRate = parseFloat(monthlyReturnPercent) / 100;
  const deposit = parseFloat(monthlyDeposit);
  const totalMonths = parseInt(months, 10);

  const schedule = [];
  let totalDeposited = balance;
  let totalProfit = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const monthlyGain = balance * returnRate;
    balance += monthlyGain + deposit;
    totalDeposited += deposit;
    totalProfit += monthlyGain;

    schedule.push({
      month: m,
      startingBalance: Number((balance - monthlyGain - deposit).toFixed(2)),
      profit: Number(monthlyGain.toFixed(2)),
      deposit,
      endingBalance: Number(balance.toFixed(2)),
      totalGrowthPercent: Number((((balance - initialBalance) / initialBalance) * 100).toFixed(1)),
    });
  }

  res.status(200).json({
    success: true,
    data: {
      initialBalance: Number(initialBalance),
      finalBalance: Number(balance.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
      totalDeposited: Number(totalDeposited.toFixed(2)),
      totalGainPercent: Number((((balance - initialBalance) / initialBalance) * 100).toFixed(1)),
      schedule,
    },
  });
};

module.exports = {
  calculatePositionSize,
  calculateRiskReward,
  calculateCompounding,
};
