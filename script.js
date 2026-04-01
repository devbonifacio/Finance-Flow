const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const editIdInput = document.getElementById("editId");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

const cardBalanceEl = document.getElementById("cardBalance");
const cardIncomeEl = document.getElementById("cardIncome");
const cardExpenseEl = document.getElementById("cardExpense");

const incomeBar = document.getElementById("incomeBar");
const expenseBar = document.getElementById("expenseBar");

const transactionList = document.getElementById("transactionList");
const filterButtons = document.querySelectorAll(".filter-btn");
const langButtons = document.querySelectorAll(".lang-btn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const themeToggle = document.getElementById("themeToggle");

const translations = {
  pt: {
    pageTitle: "FinanceFlow V2",
    tag: "Finance Tracker V2",
    heroTitle: "Controle o seu dinheiro com um dashboard moderno e inteligente.",
    heroText: "Registe entradas e despesas, filtre, pesquise, edite transações e acompanhe tudo num visual premium.",
    currentBalance: "Saldo Atual",
    income: "Entradas",
    expenses: "Despesas",
    addTransaction: "Adicionar Transação",
    editTransaction: "Editar Transação",
    registerIncomeExpense: "Registe as suas entradas e despesas",
    titleLabel: "Título",
    titlePlaceholder: "Ex: Salário, Compras, Internet",
    amountLabel: "Valor (€)",
    amountPlaceholder: "Ex: 250",
    typeLabel: "Tipo",
    categoryLabel: "Categoria",
    dateLabel: "Data",
    addTransactionBtn: "Adicionar Transação",
    saveChangesBtn: "Guardar Alterações",
    cancel: "Cancelar",
    totalBalance: "Saldo Total",
    totalIncome: "Total de Entradas",
    totalExpenses: "Total de Despesas",
    financialOverview: "Resumo Financeiro",
    chartText: "Comparação visual entre entradas e despesas",
    transactions: "Transações",
    latestActivity: "A sua atividade financeira mais recente",
    filterAll: "Todas",
    allCategories: "Todas as categorias",
    searchPlaceholder: "Pesquisar por título...",
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
    edit: "Editar",
    emptyState: "Ainda não existem transações com esse filtro.",
    invalidForm: "Preenche todos os campos corretamente.",
    csvName: "transacoes-financeflow.csv",
    exportCsv: "⬇️ CSV"
  },
  en: {
    pageTitle: "FinanceFlow V2",
    tag: "Finance Tracker V2",
    heroTitle: "Control your money with a modern and smart dashboard.",
    heroText: "Track income and expenses, filter, search, edit transactions and manage everything with a premium interface.",
    currentBalance: "Current Balance",
    income: "Income",
    expenses: "Expenses",
    addTransaction: "Add Transaction",
    editTransaction: "Edit Transaction",
    registerIncomeExpense: "Register your income and expenses",
    titleLabel: "Title",
    titlePlaceholder: "Ex: Salary, Groceries, Internet",
    amountLabel: "Amount (€)",
    amountPlaceholder: "Ex: 250",
    typeLabel: "Type",
    categoryLabel: "Category",
    dateLabel: "Date",
    addTransactionBtn: "Add Transaction",
    saveChangesBtn: "Save Changes",
    cancel: "Cancel",
    totalBalance: "Total Balance",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    financialOverview: "Financial Overview",
    chartText: "Visual comparison between income and expenses",
    transactions: "Transactions",
    latestActivity: "Your latest financial activity",
    filterAll: "All",
    allCategories: "All categories",
    searchPlaceholder: "Search by title...",
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
    edit: "Edit",
    emptyState: "No transactions found for this filter.",
    invalidForm: "Please fill in all fields correctly.",
    csvName: "financeflow-transactions.csv",
    exportCsv: "⬇️ CSV"
  }
};

let transactions = JSON.parse(localStorage.getItem("financeFlowTransactions")) || [];
let currentFilter = "all";
let currentLang = localStorage.getItem("financeFlowLanguage") || "pt";
let currentTheme = localStorage.getItem("financeFlowTheme") || "dark";

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

function formatDate(dateString) {
  const locale = currentLang === "pt" ? "pt-PT" : "en-GB";
  return new Date(dateString + "T00:00:00").toLocaleDateString(locale);
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function saveTransactions() {
  localStorage.setItem("financeFlowTransactions", JSON.stringify(transactions));
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

  updateChart(income, expense);
}

function updateChart(income, expense) {
  const total = income + expense;

  if (total === 0) {
    incomeBar.style.width = "0%";
    expenseBar.style.width = "0%";
    return;
  }

  incomeBar.style.width = `${(income / total) * 100}%`;
  expenseBar.style.width = `${(expense / total) * 100}%`;
}

function getFilteredTransactions() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const categoryValue = categoryFilter.value;

  return transactions.filter(transaction => {
    const matchesType =
      currentFilter === "all" || transaction.type === currentFilter;

    const matchesCategory =
      categoryValue === "all" || transaction.category === categoryValue;

    const matchesSearch =
      transaction.title.toLowerCase().includes(searchValue);

    return matchesType && matchesCategory && matchesSearch;
  });
}

function renderTransactions() {
  transactionList.innerHTML = "";
  const filteredTransactions = getFilteredTransactions();

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

        <div class="action-group">
          <button class="edit-btn" data-action="edit" data-id="${transaction.id}">
            ${translations[currentLang].edit}
          </button>
          <button class="delete-btn" data-action="delete" data-id="${transaction.id}">
            ${translations[currentLang].delete}
          </button>
        </div>
      `;

      transactionList.appendChild(item);
    });
}

function resetFormState() {
  editIdInput.value = "";
  form.reset();
  dateInput.valueAsDate = new Date();
  formTitle.textContent = translations[currentLang].addTransaction;
  submitBtn.textContent = translations[currentLang].addTransactionBtn;
  cancelEditBtn.style.display = "none";
}

function fillFormForEdit(transaction) {
  editIdInput.value = transaction.id;
  titleInput.value = transaction.title;
  amountInput.value = transaction.amount;
  typeInput.value = transaction.type;
  categoryInput.value = transaction.category;
  dateInput.value = transaction.date;

  formTitle.textContent = translations[currentLang].editTransaction;
  submitBtn.textContent = translations[currentLang].saveChangesBtn;
  cancelEditBtn.style.display = "inline-flex";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addOrUpdateTransaction(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const editId = editIdInput.value;

  if (!title || !amount || amount <= 0 || !date) {
    alert(translations[currentLang].invalidForm);
    return;
  }

  if (editId) {
    transactions = transactions.map(transaction =>
      transaction.id === editId
        ? { ...transaction, title, amount, type, category, date }
        : transaction
    );
  } else {
    const newTransaction = {
      id: crypto.randomUUID(),
      title,
      amount,
      type,
      category,
      date
    };

    transactions.push(newTransaction);
  }

  saveTransactions();
  updateSummary();
  renderTransactions();
  resetFormState();
}

function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions();
  updateSummary();
  renderTransactions();

  if (editIdInput.value === id) {
    resetFormState();
  }
}

function exportToCSV() {
  if (transactions.length === 0) return;

  const rows = [
    ["Title", "Amount", "Type", "Category", "Date"],
    ...transactions.map(transaction => [
      transaction.title,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.date
    ])
  ];

  const csvContent = rows
    .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = translations[currentLang].csvName;
  link.click();

  URL.revokeObjectURL(url);
}

function applyTheme() {
  document.body.classList.toggle("light", currentTheme === "light");
  themeToggle.textContent = currentTheme === "light" ? "☀️" : "🌙";
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("financeFlowTheme", currentTheme);
  applyTheme();
}

function updateStaticTexts() {
  document.documentElement.lang = currentLang;
  document.title = translations[currentLang].pageTitle;
  exportCsvBtn.textContent = translations[currentLang].exportCsv;

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

  if (editIdInput.value) {
    formTitle.textContent = translations[currentLang].editTransaction;
    submitBtn.textContent = translations[currentLang].saveChangesBtn;
    cancelEditBtn.style.display = "inline-flex";
  } else {
    formTitle.textContent = translations[currentLang].addTransaction;
    submitBtn.textContent = translations[currentLang].addTransactionBtn;
    cancelEditBtn.style.display = "none";
  }
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("financeFlowLanguage", lang);
  updateStaticTexts();
  updateSummary();
  renderTransactions();
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

searchInput.addEventListener("input", renderTransactions);
categoryFilter.addEventListener("change", renderTransactions);

transactionList.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === "delete") {
    deleteTransaction(id);
  }

  if (action === "edit") {
    const transaction = transactions.find(item => item.id === id);
    if (transaction) fillFormForEdit(transaction);
  }
});

cancelEditBtn.addEventListener("click", resetFormState);
form.addEventListener("submit", addOrUpdateTransaction);
exportCsvBtn.addEventListener("click", exportToCSV);
themeToggle.addEventListener("click", toggleTheme);

applyTheme();
updateStaticTexts();
updateSummary();
renderTransactions();