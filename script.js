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
const countEl = document.getElementById("transactionsCount");
const cardBalanceEl = document.getElementById("cardBalance");
const cardIncomeEl = document.getElementById("cardIncome");
const cardExpenseEl = document.getElementById("cardExpense");

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

const overviewCtx = document.getElementById("overviewChart");
const categoryCtx = document.getElementById("categoryChart");

const translations = {
  pt: {
    pageTitle: "FinanceFlow V3",
    brandSubtitle: "Premium Finance Dashboard",
    tag: "Finance Tracker Premium",
    heroTitle: "Controle o seu dinheiro com um dashboard moderno, bonito e inteligente.",
    heroText: "Registe entradas e despesas, acompanhe gráficos, filtre transações, exporte CSV e organize tudo com uma interface premium.",
    heroPrimary: "Começar agora",
    heroSecondary: "Ver transações",
    currentBalance: "Saldo Atual",
    income: "Entradas",
    expenses: "Despesas",
    transactionsCount: "Transações",
    addTransaction: "Adicionar Transação",
    editTransaction: "Editar Transação",
    registerIncomeExpense: "Registe entradas e despesas de forma rápida",
    titleLabel: "Título",
    titlePlaceholder: "Ex: Salário, Compras, Internet",
    amountLabel: "Valor (€)",
    amountPlaceholder: "Ex: 250",
    dateLabel: "Data",
    typeLabel: "Tipo",
    categoryLabel: "Categoria",
    addTransactionBtn: "Adicionar Transação",
    saveChangesBtn: "Guardar Alterações",
    cancel: "Cancelar",
    totalBalance: "Saldo Total",
    totalIncome: "Total de Entradas",
    totalExpenses: "Total de Despesas",
    overviewChart: "Resumo Geral",
    overviewChartText: "Comparação entre entradas e despesas",
    categoryChart: "Categorias",
    categoryChartText: "Distribuição das despesas por categoria",
    transactions: "Transações",
    latestActivity: "A sua atividade financeira mais recente",
    smartForm: "Formulário",
    liveList: "Lista",
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
    csvName: "financeflow-transacoes.csv",
    exportCsv: "⬇️ CSV",
    chartIncome: "Entradas",
    chartExpense: "Despesas",
    noExpenseData: "Sem despesas",
  },
  en: {
    pageTitle: "FinanceFlow V3",
    brandSubtitle: "Premium Finance Dashboard",
    tag: "Finance Tracker Premium",
    heroTitle: "Control your money with a modern, beautiful and smart dashboard.",
    heroText: "Track income and expenses, visualize charts, filter transactions, export CSV and organize everything with a premium interface.",
    heroPrimary: "Start now",
    heroSecondary: "View transactions",
    currentBalance: "Current Balance",
    income: "Income",
    expenses: "Expenses",
    transactionsCount: "Transactions",
    addTransaction: "Add Transaction",
    editTransaction: "Edit Transaction",
    registerIncomeExpense: "Register income and expenses quickly",
    titleLabel: "Title",
    titlePlaceholder: "Ex: Salary, Groceries, Internet",
    amountLabel: "Amount (€)",
    amountPlaceholder: "Ex: 250",
    dateLabel: "Date",
    typeLabel: "Type",
    categoryLabel: "Category",
    addTransactionBtn: "Add Transaction",
    saveChangesBtn: "Save Changes",
    cancel: "Cancel",
    totalBalance: "Total Balance",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    overviewChart: "Overview",
    overviewChartText: "Comparison between income and expenses",
    categoryChart: "Categories",
    categoryChartText: "Expense distribution by category",
    transactions: "Transactions",
    latestActivity: "Your latest financial activity",
    smartForm: "Form",
    liveList: "List",
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
    exportCsv: "⬇️ CSV",
    chartIncome: "Income",
    chartExpense: "Expenses",
    noExpenseData: "No expenses",
  }
};

let transactions = JSON.parse(localStorage.getItem("financeFlowV3Transactions")) || [];
let currentFilter = "all";
let currentLang = localStorage.getItem("financeFlowV3Language") || "pt";
let currentTheme = localStorage.getItem("financeFlowV3Theme") || "dark";
let overviewChart;
let categoryChart;

dateInput.valueAsDate = new Date();

function getThemeColors() {
  const isLight = currentTheme === "light";
  return {
    text: isLight ? "#0f172a" : "#f8fafc",
    muted: isLight ? "#64748b" : "#94a3b8",
    grid: isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.08)",
    income: "#22c55e",
    expense: "#ef4444",
    purple: "#7c3aed",
    palette: ["#7c3aed", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899", "#6366f1"],
  };
}

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
  localStorage.setItem("financeFlowV3Transactions", JSON.stringify(transactions));
}

function getTranslatedCategory(category) {
  const map = {
    Salary: "catSalary",
    Food: "catFood",
    Transport: "catTransport",
    Shopping: "catShopping",
    Bills: "catBills",
    Health: "catHealth",
    Entertainment: "catEntertainment",
    Other: "catOther",
  };
  return translations[currentLang][map[category] || "catOther"];
}

function getSummaryValues() {
  const income = transactions
    .filter(item => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactions
    .filter(item => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
    count: transactions.length,
  };
}

function updateSummary() {
  const { income, expense, balance, count } = getSummaryValues();

  balanceEl.textContent = formatCurrency(balance);
  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
  countEl.textContent = count;

  cardBalanceEl.textContent = formatCurrency(balance);
  cardIncomeEl.textContent = formatCurrency(income);
  cardExpenseEl.textContent = formatCurrency(expense);

  updateCharts();
}

function getFilteredTransactions() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const categoryValue = categoryFilter.value;

  return transactions.filter(transaction => {
    const typeMatch = currentFilter === "all" || transaction.type === currentFilter;
    const categoryMatch = categoryValue === "all" || transaction.category === categoryValue;
    const searchMatch = transaction.title.toLowerCase().includes(searchValue);

    return typeMatch && categoryMatch && searchMatch;
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
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach(transaction => {
      const item = document.createElement("article");
      item.className = "transaction-item";

      const typeLabel = transaction.type === "income"
        ? translations[currentLang].badgeIncome
        : translations[currentLang].badgeExpense;

      item.innerHTML = `
        <div class="transaction-main">
          <h4>${escapeHTML(transaction.title)}</h4>
          <div class="transaction-meta">
            <span>${getTranslatedCategory(transaction.category)}</span>
            <span>•</span>
            <span>${formatDate(transaction.date)}</span>
            <span class="badge ${transaction.type === "income" ? "badge-income" : "badge-expense"}">${typeLabel}</span>
          </div>
        </div>

        <div class="transaction-amount ${transaction.type === "income" ? "amount-income" : "amount-expense"}">
          ${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}
        </div>

        <div class="action-group">
          <button class="edit-btn" data-action="edit" data-id="${transaction.id}">${translations[currentLang].edit}</button>
          <button class="delete-btn" data-action="delete" data-id="${transaction.id}">${translations[currentLang].delete}</button>
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
    transactions = transactions.map(item =>
      item.id === editId ? { ...item, title, amount, type, category, date } : item
    );
  } else {
    transactions.push({
      id: crypto.randomUUID(),
      title,
      amount,
      type,
      category,
      date,
    });
  }

  saveTransactions();
  updateSummary();
  renderTransactions();
  resetFormState();
}

function deleteTransaction(id) {
  transactions = transactions.filter(item => item.id !== id);
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
    ...transactions.map(item => [item.title, item.amount, item.type, item.category, item.date])
  ];

  const csv = rows
    .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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
  if (overviewChart || categoryChart) updateCharts();
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("financeFlowV3Theme", currentTheme);
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

  langButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.lang === currentLang);
  });

  filterButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
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
  localStorage.setItem("financeFlowV3Language", lang);
  updateStaticTexts();
  updateSummary();
  renderTransactions();
}

function buildOverviewChart() {
  const colors = getThemeColors();
  const { income, expense } = getSummaryValues();

  if (overviewChart) overviewChart.destroy();
  overviewChart = new Chart(overviewCtx, {
    type: "bar",
    data: {
      labels: [translations[currentLang].chartIncome, translations[currentLang].chartExpense],
      datasets: [{
        data: [income, expense],
        backgroundColor: [colors.income, colors.expense],
        borderRadius: 14,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => formatCurrency(ctx.raw)
          }
        }
      },
      scales: {
        x: {
          ticks: { color: colors.muted, font: { weight: "700" } },
          grid: { display: false }
        },
        y: {
          ticks: {
            color: colors.muted,
            callback: value => formatCurrency(value)
          },
          grid: { color: colors.grid }
        }
      }
    }
  });
}

function buildCategoryChart() {
  const colors = getThemeColors();
  const expenseItems = transactions.filter(item => item.type === "expense");
  const totals = {};

  expenseItems.forEach(item => {
    totals[item.category] = (totals[item.category] || 0) + item.amount;
  });

  const labels = Object.keys(totals);
  const values = Object.values(totals);

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(categoryCtx, {
    type: "doughnut",
    data: {
      labels: labels.length ? labels.map(getTranslatedCategory) : [translations[currentLang].noExpenseData],
      datasets: [{
        data: values.length ? values : [1],
        backgroundColor: values.length ? colors.palette : [colors.grid],
        borderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: colors.muted,
            usePointStyle: true,
            padding: 18,
            font: { weight: "700" }
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => values.length ? `${ctx.label}: ${formatCurrency(ctx.raw)}` : ctx.label
          }
        }
      }
    }
  });
}

function updateCharts() {
  buildOverviewChart();
  buildCategoryChart();
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

  if (action === "delete") deleteTransaction(id);
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
