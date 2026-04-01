const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const transactionList = document.getElementById("transactionList");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

const cardBalanceEl = document.getElementById("cardBalance");
const cardIncomeEl = document.getElementById("cardIncome");
const cardExpenseEl = document.getElementById("cardExpense");

const filterButtons = document.querySelectorAll(".filter-btn");
const langButtons = document.querySelectorAll(".lang-btn");

const translations = {
  pt: {
    pageTitle: "Finance Tracker Premium",
    tag: "Finance Tracker",
    heroTitle: "Controle o seu dinheiro com um dashboard moderno e premium.",
    heroText: "Registe entradas e despesas, acompanhe o saldo e organize melhor a sua vida financeira com um visual bonito e profissional.",
    currentBalance: "Saldo Atual",
    income: "Entradas",
    expenses: "Despesas",
    addTransaction: "Adicionar Transação",
    registerIncomeExpense: "Registe as suas entradas e despesas",
    titleLabel: "Título",
    titlePlaceholder: "Ex: Salário, Compras, Internet",
    amountLabel: "Valor (€)",
    amountPlaceholder: "Ex: 250",
    typeLabel: "Tipo",
    categoryLabel: "Categoria",
    dateLabel: "Data",
    addTransactionBtn: "Adicionar Transação",
    totalBalance: "Saldo Total",
    totalIncome: "Total de Entradas",
    totalExpenses: "Total de Despesas",
    transactions: "Transações",
    latestActivity: "A sua atividade financeira mais recente",
    filterAll: "Todas",
    catSalary: "Salário",
    catFood: "Comida",
    catTransport: "Transporte",
    catShopping: "Compras",
    catBills: "Contas",
    catHealth: "Saúde",
    catEntertainment: "Entretenimento",
    catOther: "Outro",
    badgeIncome: "Entrada",
    badgeExpense: "Despesa",
    delete: "Apagar",
    emptyState: "Ainda não existem transações.",
    invalidForm: "Preenche todos os campos corretamente.",
  },
  en: {
    pageTitle: "Finance Tracker Premium",
    tag: "Finance Tracker",
    heroTitle: "Control your money with a modern and premium dashboard.",
    heroText: "Track income and expenses, monitor your balance, and organize your financial life with a beautiful and professional interface.",
    currentBalance: "Current Balance",
    income: "Income",
    expenses: "Expenses",
    addTransaction: "Add Transaction",
    registerIncomeExpense: "Register your income and expenses",
    titleLabel: "Title",
    titlePlaceholder: "Ex: Salary, Groceries, Internet",
    amountLabel: "Amount (€)",
    amountPlaceholder: "Ex: 250",
    typeLabel: "Type",
    categoryLabel: "Category",
    dateLabel: "Date",
    addTransactionBtn: "Add Transaction",
    totalBalance: "Total Balance",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    transactions: "Transactions",
    latestActivity: "Your latest financial activity",
    filterAll: "All",
    catSalary: "Salary",
    catFood: "Food",
    catTransport: "Transport",
    catShopping: "Shopping",
    catBills: "Bills",
    catHealth: "Health",
    catEntertainment: "Entertainment",
    catOther: "Other",
    badgeIncome: "Income",
    badgeExpense: "Expense",
    delete: "Delete",
    emptyState: "No transactions found yet.",
    invalidForm: "Please fill in all fields correctly.",
  }
};

let transactions = JSON.parse(localStorage.getItem("financeTransactions")) || [];
let currentFilter = "all";
let currentLang = localStorage.getItem("financeLanguage") || "pt";

dateInput.valueAsDate = new Date();

function getCurrencyLocale() {
  return currentLang === "pt" ? "pt-PT" : "en-IE";
}

function formatCurrency(value) {
  return new Intl.NumberFormat(getCurrencyLocale(), {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

function saveTransactions() {
  localStorage.setItem("financeTransactions", JSON.stringify(transactions));
}

function getTranslatedCategory(category) {
  const categoryMap = {
    Salary: "catSalary",
    Food: "catFood",
    Transport: "catTransport",
    Shopping: "catShopping",
    Bills: "catBills",
    Health: "catHealth",
    Entertainment: "catEntertainment",
    Other: "catOther"
  };

  const key = categoryMap[category] || "catOther";
  return translations[currentLang][key];
}

function updateSummary() {
  const income = transactions
    .filter(transaction => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter(transaction => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expense;

  balanceEl.textContent = formatCurrency(balance);
  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);

  cardBalanceEl.textContent = formatCurrency(balance);
  cardIncomeEl.textContent = formatCurrency(income);
  cardExpenseEl.textContent = formatCurrency(expense);
}

function renderTransactions() {
  transactionList.innerHTML = "";

  let filteredTransactions = transactions;

  if (currentFilter !== "all") {
    filteredTransactions = transactions.filter(
      transaction => transaction.type === currentFilter
    );
  }

  if (filteredTransactions.length === 0) {
    transactionList.innerHTML = `
      <div class="empty-state">
        <p>${translations[currentLang].emptyState}</p>
      </div>
    `;
    return;
  }

  filteredTransactions
    .slice()
    .reverse()
    .forEach(transaction => {
      const item = document.createElement("div");
      item.className = "transaction-item";

      const typeLabel =
        transaction.type === "income"
          ? translations[currentLang].badgeIncome
          : translations[currentLang].badgeExpense;

      item.innerHTML = `
        <div class="transaction-main">
          <h4>${escapeHTML(transaction.title)}</h4>
          <div class="transaction-meta">
            <span>${getTranslatedCategory(transaction.category)}</span>
            <span>•</span>
            <span>${formatDate(transaction.date)}</span>
            <span class="badge ${transaction.type === "income" ? "badge-income" : "badge-expense"}">
              ${typeLabel}
            </span>
          </div>
        </div>

        <div class="transaction-amount ${transaction.type === "income" ? "amount-income" : "amount-expense"}">
          ${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}
        </div>

        <button class="delete-btn" data-id="${transaction.id}">
          ${translations[currentLang].delete}
        </button>
      `;

      transactionList.appendChild(item);
    });
}

function formatDate(dateString) {
  const locale = currentLang === "pt" ? "pt-PT" : "en-GB";
  return new Date(dateString + "T00:00:00").toLocaleDateString(locale);
}

function addTransaction(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!title || !amount || amount <= 0 || !date) {
    alert(translations[currentLang].invalidForm);
    return;
  }

  const newTransaction = {
    id: crypto.randomUUID(),
    title,
    amount,
    type,
    category,
    date
  };

  transactions.push(newTransaction);
  saveTransactions();
  updateSummary();
  renderTransactions();

  form.reset();
  dateInput.valueAsDate = new Date();
}

function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions();
  updateSummary();
  renderTransactions();
}

function updateStaticTexts() {
  document.documentElement.lang = currentLang;
  document.title = translations[currentLang].pageTitle;

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.dataset.i18nPlaceholder;
    if (translations[currentLang][key]) {
      element.placeholder = translations[currentLang][key];
    }
  });

  filterButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
  });

  langButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.lang === currentLang);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("financeLanguage", lang);
  updateStaticTexts();
  updateSummary();
  renderTransactions();
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    updateStaticTexts();
    renderTransactions();
  });
});

langButtons.forEach(button => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

transactionList.addEventListener("click", event => {
  if (event.target.classList.contains("delete-btn")) {
    deleteTransaction(event.target.dataset.id);
  }
});

form.addEventListener("submit", addTransaction);

updateStaticTexts();
updateSummary();
renderTransactions();
