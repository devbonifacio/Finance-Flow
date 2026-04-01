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
const langButtons = document.querySelectorAll("[data-lang]");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const themeToggle = document.getElementById("themeToggle");

const overviewCanvas = document.getElementById("overviewChart");
const categoryCanvas = document.getElementById("categoryChart");

const translations = {
  pt: {
    brandSubtitle: "Premium Finance Dashboard",
    heroBadge: "Finance Tracker Premium",
    heroTitle: "Controle o seu dinheiro com um dashboard bonito, moderno e profissional.",
    heroText: "Adicione entradas e despesas, acompanhe gráficos em tempo real, filtre transações e exporte os seus dados com uma experiência premium.",
    heroPrimary: "Começar",
    heroSecondary: "Ver transações",
    currentBalance: "Saldo Atual",
    income: "Entradas",
    expenses: "Despesas",
    transactionsCount: "Transações",
    addTransaction: "Adicionar Transação",
    editTransaction: "Editar Transação",
    formText: "Preencha os campos para registar uma transação.",
    smartForm: "Formulário",
    liveList: "Lista",
    titleLabel: "Título",
    amountLabel: "Valor (€)",
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
    filterAll: "Todas",
    allCategories: "Todas as categorias",
    catSalary: "Salário",
    catFood: "Comida",
    catTransport: "Transporte",
    catShopping: "Compras",
    catBills: "Contas",
    catHealth: "Saúde",
    catEntertainment: "Entretenimento",
    catOther: "Outro",
    edit: "Editar",
    delete: "Apagar",
    badgeIncome: "Entrada",
    badgeExpense: "Despesa",
    emptyState: "Ainda não existem transações com esse filtro.",
    invalidForm: "Preenche todos os campos corretamente.",
    titlePlaceholder: "Ex: Salário, Compras, Internet",
    amountPlaceholder: "Ex: 250",
    searchPlaceholder: "Pesquisar por título...",
    csvName: "financeflow-pro-transacoes.csv",
    chartIncome: "Entradas",
    chartExpense: "Despesas",
    noExpenseData: "Sem despesas"
  },
  en: {
    brandSubtitle: "Premium Finance Dashboard",
    heroBadge: "Finance Tracker Premium",
    heroTitle: "Control your money with a beautiful, modern and professional dashboard.",
    heroText: "Add income and expenses, track charts in real time, filter transactions and export your data with a premium experience.",
    heroPrimary: "Start",
    heroSecondary: "View transactions",
    currentBalance: "Current Balance",
    income: "Income",
    expenses: "Expenses",
    transactionsCount: "Transactions",
    addTransaction: "Add Transaction",
    editTransaction: "Edit Transaction",
    formText: "Fill in the fields to register a transaction.",
    smartForm: "Form",
    liveList: "List",
    titleLabel: "Title",
    amountLabel: "Amount (€)",
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
    filterAll: "All",
    allCategories: "All categories",
    catSalary: "Salary",
    catFood: "Food",
    catTransport: "Transport",
    catShopping: "Shopping",
    catBills: "Bills",
    catHealth: "Health",
    catEntertainment: "Entertainment",
    catOther: "Other",
    edit: "Edit",
    delete: "Delete",
    badgeIncome: "Income",
    badgeExpense: "Expense",
    emptyState: "No transactions found for this filter.",
    invalidForm: "Please fill in all fields correctly.",
    titlePlaceholder: "Ex: Salary, Groceries, Internet",
    amountPlaceholder: "Ex: 250",
    searchPlaceholder: "Search by title...",
    csvName: "financeflow-pro-transactions.csv",
    chartIncome: "Income",
    chartExpense: "Expenses",
    noExpenseData: "No expenses"
  }
};

let transactions = JSON.parse(localStorage.getItem("financeFlowProTransactions")) || [];
let currentFilter = "all";
let currentLang = localStorage.getItem("financeFlowProLanguage") || "pt";
let currentTheme = localStorage.getItem("financeFlowProTheme") || "dark";
let overviewChart = null;
let categoryChart = null;

dateInput.valueAsDate = new Date();

function t(key) {
  return translations[currentLang][key] || key;
}

function getLocale() {
  return currentLang === "pt" ? "pt-PT" : "en-IE";
}

function formatCurrency(value) {
  return new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

function formatDate(dateString) {
  const locale = currentLang === "pt" ? "pt-PT" : "en-GB";
  return new Date(dateString + "T00:00:00").toLocaleDateString(locale);
}

function saveTransactions() {
  localStorage.setItem("financeFlowProTransactions", JSON.stringify(transactions));
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function translatedCategory(category) {
  const map = {
    Salary: "catSalary",
    Food: "catFood",
    Transport: "catTransport",
    Shopping: "catShopping",
    Bills: "catBills",
    Health: "catHealth",
    Entertainment: "catEntertainment",
    Other: "catOther"
  };
  return t(map[category] || "catOther");
}

function getSummary() {
  const income = transactions.filter(item => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions.filter(item => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  return {
    income,
    expense,
    balance: income - expense,
    count: transactions.length
  };
}

function updateSummary() {
  const { income, expense, balance, count } = getSummary();
  balanceEl.textContent = formatCurrency(balance);
  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
  countEl.textContent = count;

  cardBalanceEl.textContent = formatCurrency(balance);
  cardIncomeEl.textContent = formatCurrency(income);
  cardExpenseEl.textContent = formatCurrency(expense);

  renderCharts();
}

function filteredTransactions() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  return transactions.filter(item => {
    const byType = currentFilter === "all" || item.type === currentFilter;
    const byCategory = category === "all" || item.category === category;
    const bySearch = item.title.toLowerCase().includes(search);
    return byType && byCategory && bySearch;
  });
}

function renderTransactions() {
  const list = filteredTransactions()
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  transactionList.innerHTML = "";

  if (list.length === 0) {
    transactionList.innerHTML = `<div class="empty-state"><p>${t("emptyState")}</p></div>`;
    return;
  }

  for (const item of list) {
    const article = document.createElement("article");
    article.className = "transaction-item";

    const badgeText = item.type === "income" ? t("badgeIncome") : t("badgeExpense");

    article.innerHTML = `
      <div class="transaction-main">
        <h4>${escapeHTML(item.title)}</h4>
        <div class="transaction-meta">
          <span>${translatedCategory(item.category)}</span>
          <span>•</span>
          <span>${formatDate(item.date)}</span>
          <span class="tx-badge ${item.type}">${badgeText}</span>
        </div>
      </div>

      <div class="transaction-amount ${item.type}">
        ${item.type === "income" ? "+" : "-"}${formatCurrency(item.amount)}
      </div>

      <div class="action-group">
        <button type="button" class="edit-btn" data-action="edit" data-id="${item.id}">${t("edit")}</button>
        <button type="button" class="delete-btn" data-action="delete" data-id="${item.id}">${t("delete")}</button>
      </div>
    `;

    transactionList.appendChild(article);
  }
}

function resetForm() {
  form.reset();
  editIdInput.value = "";
  dateInput.valueAsDate = new Date();
  formTitle.textContent = t("addTransaction");
  submitBtn.textContent = t("addTransactionBtn");
  cancelEditBtn.classList.add("hidden");
}

function fillForm(transaction) {
  editIdInput.value = transaction.id;
  titleInput.value = transaction.title;
  amountInput.value = transaction.amount;
  typeInput.value = transaction.type;
  categoryInput.value = transaction.category;
  dateInput.value = transaction.date;
  formTitle.textContent = t("editTransaction");
  submitBtn.textContent = t("saveChangesBtn");
  cancelEditBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleSubmit(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const editId = editIdInput.value;

  if (!title || !amount || amount <= 0 || !date) {
    alert(t("invalidForm"));
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
      date
    });
  }

  saveTransactions();
  updateSummary();
  renderTransactions();
  resetForm();
}

function deleteTransaction(id) {
  transactions = transactions.filter(item => item.id !== id);
  saveTransactions();
  updateSummary();
  renderTransactions();
  if (editIdInput.value === id) resetForm();
}

function exportCSV() {
  if (!transactions.length) return;

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
  link.download = t("csvName");
  link.click();

  URL.revokeObjectURL(url);
}

function chartColors() {
  const light = currentTheme === "light";
  return {
    text: light ? "#0f172a" : "#f8fafc",
    muted: light ? "#64748b" : "#94a3b8",
    grid: light ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.08)",
    palette: ["#7c3aed", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899", "#6366f1"]
  };
}

function renderCharts() {
  if (typeof Chart === "undefined") return;

  const colors = chartColors();
  const { income, expense } = getSummary();

  if (overviewChart) overviewChart.destroy();
  if (categoryChart) categoryChart.destroy();

  overviewChart = new Chart(overviewCanvas, {
    type: "bar",
    data: {
      labels: [t("chartIncome"), t("chartExpense")],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderRadius: 14,
        borderSkipped: false
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
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

  const expenseItems = transactions.filter(item => item.type === "expense");
  const totals = {};
  for (const item of expenseItems) {
    totals[item.category] = (totals[item.category] || 0) + item.amount;
  }

  const labels = Object.keys(totals);
  const values = Object.values(totals);

  categoryChart = new Chart(categoryCanvas, {
    type: "doughnut",
    data: {
      labels: labels.length ? labels.map(translatedCategory) : [t("noExpenseData")],
      datasets: [{
        data: values.length ? values : [1],
        backgroundColor: values.length ? colors.palette : [colors.grid],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: colors.muted,
            padding: 18,
            usePointStyle: true,
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

function applyTheme() {
  document.body.classList.toggle("light", currentTheme === "light");
  themeToggle.textContent = currentTheme === "light" ? "☀️" : "🌙";
  renderCharts();
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("financeFlowProTheme", currentTheme);
  applyTheme();
}

function updateStaticTexts() {
  document.documentElement.lang = currentLang === "pt" ? "pt-PT" : "en";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  titleInput.placeholder = t("titlePlaceholder");
  amountInput.placeholder = t("amountPlaceholder");
  searchInput.placeholder = t("searchPlaceholder");

  langButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });

  filterButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  });

  if (editIdInput.value) {
    formTitle.textContent = t("editTransaction");
    submitBtn.textContent = t("saveChangesBtn");
    cancelEditBtn.classList.remove("hidden");
  } else {
    formTitle.textContent = t("addTransaction");
    submitBtn.textContent = t("addTransactionBtn");
    cancelEditBtn.classList.add("hidden");
  }
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("financeFlowProLanguage", lang);
  updateStaticTexts();
  updateSummary();
  renderTransactions();
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    updateStaticTexts();
    renderTransactions();
  });
});

langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
  });
});

searchInput.addEventListener("input", renderTransactions);
categoryFilter.addEventListener("change", renderTransactions);

transactionList.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "delete") deleteTransaction(id);
  if (action === "edit") {
    const transaction = transactions.find(item => item.id === id);
    if (transaction) fillForm(transaction);
  }
});

form.addEventListener("submit", handleSubmit);
cancelEditBtn.addEventListener("click", resetForm);
themeToggle.addEventListener("click", toggleTheme);
exportCsvBtn.addEventListener("click", exportCSV);

applyTheme();
updateStaticTexts();
updateSummary();
renderTransactions();
