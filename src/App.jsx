import { useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Home, List, Wallet, BarChart2,
  Settings, Tag,
} from "lucide-react";

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const CURRENCY = "₱";
const ACCOUNT_TYPES = [
  { value: "cash",   label: "Cash",          icon: "💵" },
  { value: "bank",   label: "Bank Account",  icon: "🏦" },
  { value: "ewallet",label: "E-Wallet",      icon: "📱" },
  { value: "credit", label: "Credit Card",   icon: "💳" },
];
const PALETTE = [
  "#6366F1","#8B5CF6","#EC4899","#EF4444","#F59E0B",
  "#10B981","#14B8A6","#3B82F6","#84CC16","#F97316",
  "#06B6D4","#D946EF","#F43F5E","#A855F7",
];
const fmt = (n) =>
  `${CURRENCY}${Number(n || 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const monthLabel = (m) => {
  const [y, mo] = m.split("-");
  return new Date(y, mo - 1).toLocaleDateString("en", { month: "long", year: "numeric" });
};
let _id = 300;
const newId = () => ++_id;

// ── INITIAL DATA ───────────────────────────────────────────────────────────────
const initAccounts = [
  { id: 1, name: "Cash",       type: "cash",    balance: 5000,  color: "#10B981" },
  { id: 2, name: "BDO Savings",type: "bank",    balance: 25000, color: "#3B82F6" },
  { id: 3, name: "GCash",      type: "ewallet", balance: 3500,  color: "#8B5CF6" },
  { id: 4, name: "Maya",       type: "ewallet", balance: 1200,  color: "#F59E0B" },
];
const initCategories = [
  { id: 1,  name: "Food & Dining",     type: "expense", color: "#EF4444", icon: "🍔" },
  { id: 2,  name: "Transportation",    type: "expense", color: "#F59E0B", icon: "🚗" },
  { id: 3,  name: "Dates",             type: "expense", color: "#EC4899", icon: "❤️"  },
  { id: 4,  name: "Clothes",           type: "expense", color: "#8B5CF6", icon: "👕" },
  { id: 5,  name: "Subscriptions",     type: "expense", color: "#6366F1", icon: "📱" },
  { id: 6,  name: "Bills & Utilities", type: "expense", color: "#DC2626", icon: "📄" },
  { id: 7,  name: "Savings",           type: "expense", color: "#10B981", icon: "🏦" },
  { id: 8,  name: "Personal",          type: "expense", color: "#14B8A6", icon: "🛍️" },
  { id: 9,  name: "Entertainment",     type: "expense", color: "#F97316", icon: "🎮" },
  { id: 10, name: "Health",            type: "expense", color: "#06B6D4", icon: "💊" },
  { id: 11, name: "Salary",            type: "income",  color: "#22C55E", icon: "💰" },
  { id: 12, name: "Freelance",         type: "income",  color: "#84CC16", icon: "💻" },
  { id: 13, name: "Bonus",             type: "income",  color: "#10B981", icon: "🎁" },
];
const initTransactions = [
  { id: 1,  date: "2026-04-10", description: "Grocery shopping",  amount: 850,  type: "expense", categoryId: 1,  accountId: 2 },
  { id: 2,  date: "2026-04-09", description: "Netflix",           amount: 549,  type: "expense", categoryId: 5,  accountId: 4 },
  { id: 3,  date: "2026-04-09", description: "Date night dinner", amount: 1200, type: "expense", categoryId: 3,  accountId: 3 },
  { id: 4,  date: "2026-04-08", description: "Grab ride",         amount: 150,  type: "expense", categoryId: 2,  accountId: 3 },
  { id: 5,  date: "2026-04-07", description: "Electric bill",     amount: 2200, type: "expense", categoryId: 6,  accountId: 2 },
  { id: 6,  date: "2026-04-06", description: "New shoes",         amount: 1800, type: "expense", categoryId: 4,  accountId: 3 },
  { id: 7,  date: "2026-04-05", description: "Monthly salary",    amount: 35000,type: "income",  categoryId: 11, accountId: 2 },
  { id: 8,  date: "2026-04-03", description: "Freelance project", amount: 5000, type: "income",  categoryId: 12, accountId: 3 },
  { id: 9,  date: "2026-04-02", description: "Coffee & snacks",   amount: 320,  type: "expense", categoryId: 1,  accountId: 1 },
  { id: 10, date: "2026-04-01", description: "Internet bill",     amount: 1299, type: "expense", categoryId: 6,  accountId: 2 },
  { id: 11, date: "2026-03-31", description: "Monthly salary",    amount: 35000,type: "income",  categoryId: 11, accountId: 2 },
  { id: 12, date: "2026-03-28", description: "Grocery",           amount: 1200, type: "expense", categoryId: 1,  accountId: 2 },
  { id: 13, date: "2026-03-25", description: "Movie date",        amount: 800,  type: "expense", categoryId: 3,  accountId: 3 },
  { id: 14, date: "2026-03-20", description: "Gym membership",    amount: 999,  type: "expense", categoryId: 8,  accountId: 2 },
  { id: 15, date: "2026-03-15", description: "Water bill",        amount: 350,  type: "expense", categoryId: 6,  accountId: 2 },
  { id: 16, date: "2026-03-10", description: "Freelance bonus",   amount: 3000, type: "income",  categoryId: 13, accountId: 3 },
  { id: 17, date: "2026-03-08", description: "Spotify",           amount: 179,  type: "expense", categoryId: 5,  accountId: 4 },
  { id: 18, date: "2026-03-05", description: "Pharmacy",          amount: 450,  type: "expense", categoryId: 10, accountId: 1 },
];
const initBudgets = [
  { id: 1, categoryId: 1, amount: 5000, month: "2026-04" },
  { id: 2, categoryId: 2, amount: 2000, month: "2026-04" },
  { id: 3, categoryId: 3, amount: 3000, month: "2026-04" },
  { id: 4, categoryId: 4, amount: 2000, month: "2026-04" },
  { id: 5, categoryId: 5, amount: 1000, month: "2026-04" },
  { id: 6, categoryId: 6, amount: 5000, month: "2026-04" },
  { id: 7, categoryId: 7, amount: 5000, month: "2026-04" },
  { id: 8, categoryId: 8, amount: 2000, month: "2026-04" },
];

// ── HELPERS ────────────────────────────────────────────────────────────────────
const prevMonthStr = (m) => {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(y, mo - 2);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const nextMonthStr = (m) => {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(y, mo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// ── REUSABLE COMPONENTS ────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function MonthNav({ current, onChange }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
      <button onClick={() => onChange(prevMonthStr(current))}
        className="text-gray-500 hover:text-indigo-600 p-1 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <span className="font-semibold text-gray-800">{monthLabel(current)}</span>
      <button onClick={() => onChange(nextMonthStr(current))}
        className="text-gray-500 hover:text-indigo-600 p-1 transition-colors">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function TxRow({ tx, catMap, accMap, onEdit, onDelete }) {
  const cat = catMap[tx.categoryId];
  const acc = accMap[tx.accountId];
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-gray-50 group transition-colors">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: (cat?.color || "#999") + "22" }}>
        {cat?.icon || "💸"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
        <p className="text-xs text-gray-400">{cat?.name || "—"} · {acc?.name || "—"} · {tx.date}</p>
      </div>
      <p className={`text-sm font-bold flex-shrink-0 ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
        {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
      </p>
      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
        <button onClick={() => onEdit(tx)} className="text-gray-300 hover:text-indigo-500 p-1 transition-colors">
          <Edit2 size={14} />
        </button>
        <button onClick={() => onDelete(tx.id)} className="text-gray-300 hover:text-red-500 p-1 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ── MODALS ─────────────────────────────────────────────────────────────────────
function TransactionModal({ tx, categories, accounts, onSave, onClose }) {
  const [form, setForm] = useState(
    tx
      ? { ...tx }
      : {
          date: new Date().toISOString().split("T")[0],
          description: "",
          amount: "",
          type: "expense",
          categoryId: categories.find((c) => c.type === "expense")?.id || 1,
          accountId: accounts[0]?.id || 1,
        }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleTypeChange = (type) => {
    const first = categories.find((c) => c.type === type);
    setForm((f) => ({ ...f, type, categoryId: first?.id || f.categoryId }));
  };
  const filteredCats = categories.filter((c) => c.type === form.type);

  const handleSubmit = () => {
    if (!form.description.trim() || !form.amount || !form.date) return;
    onSave({ ...form, amount: parseFloat(form.amount), id: form.id || newId() });
  };

  return (
    <Modal title={tx ? "Edit Transaction" : "Add Transaction"} onClose={onClose}>
      <div className="space-y-4">
        {/* Type */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
          {["expense", "income"].map((type) => (
            <button key={type} onClick={() => handleTypeChange(type)}
              className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors
                ${form.type === type
                  ? type === "expense" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              {type}
            </button>
          ))}
        </div>
        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-gray-700">Amount</label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{CURRENCY}</span>
            <input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="0.00" step="0.01" />
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <input type="text" value={form.description} onChange={(e) => set("description", e.target.value)}
            className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="What was this for?" />
        </div>
        {/* Date */}
        <div>
          <label className="text-sm font-medium text-gray-700">Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
            className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select value={form.categoryId} onChange={(e) => set("categoryId", Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
            {filteredCats.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
        {/* Account */}
        <div>
          <label className="text-sm font-medium text-gray-700">Account</label>
          <select value={form.accountId} onChange={(e) => set("accountId", Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
            {accounts.map((a) => {
              const t = ACCOUNT_TYPES.find((t) => t.value === a.type);
              return <option key={a.id} value={a.id}>{t?.icon} {a.name}</option>;
            })}
          </select>
        </div>
        <button onClick={handleSubmit}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
          {tx ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </Modal>
  );
}

function AccountModal({ account, onSave, onClose }) {
  const [form, setForm] = useState(
    account ? { ...account } : { name: "", type: "bank", balance: "", color: PALETTE[5] }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, balance: parseFloat(form.balance) || 0, id: form.id || newId() });
  };
  return (
    <Modal title={account ? "Edit Account" : "Add Account"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Account Name</label>
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
            className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. BDO Savings" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Account Type</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {ACCOUNT_TYPES.map((t) => (
              <button key={t.value} onClick={() => set("type", t.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors
                  ${form.type === t.value ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Current Balance</label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{CURRENCY}</span>
            <input type="number" value={form.balance} onChange={(e) => set("balance", e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Color</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PALETTE.map((c) => (
              <button key={c} onClick={() => set("color", c)}
                className={`w-8 h-8 rounded-full transition-all ${form.color === c ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : "hover:scale-110"}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <button onClick={handleSubmit}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
          {account ? "Save Changes" : "Add Account"}
        </button>
      </div>
    </Modal>
  );
}

function BudgetModal({ budget, categories, currentMonth, onSave, onClose }) {
  const expenseCats = categories.filter((c) => c.type === "expense");
  const [form, setForm] = useState(
    budget
      ? { ...budget }
      : { categoryId: expenseCats[0]?.id || 1, amount: "", month: currentMonth }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = () => {
    if (!form.amount) return;
    onSave({ ...form, amount: parseFloat(form.amount), id: form.id || newId() });
  };
  return (
    <Modal title={budget ? "Edit Budget" : "Set Budget"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select value={form.categoryId} onChange={(e) => set("categoryId", Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
            {expenseCats.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Budget Amount</label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{CURRENCY}</span>
            <input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Month</label>
          <input type="month" value={form.month} onChange={(e) => set("month", e.target.value)}
            className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <button onClick={handleSubmit}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
          {budget ? "Save Changes" : "Set Budget"}
        </button>
      </div>
    </Modal>
  );
}

function CategoryModal({ category, onSave, onClose }) {
  const [form, setForm] = useState(
    category ? { ...category } : { name: "", type: "expense", color: PALETTE[0], icon: "📦" }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, id: form.id || newId() });
  };
  return (
    <Modal title={category ? "Edit Category" : "Add Category"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Category Name</label>
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
            className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. Dining Out" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Type</label>
          <div className="mt-1 flex rounded-xl overflow-hidden border border-gray-200">
            {["expense", "income"].map((type) => (
              <button key={type} onClick={() => set("type", type)}
                className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors
                  ${form.type === type
                    ? type === "expense" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Icon (paste any emoji)</label>
          <input type="text" value={form.icon} onChange={(e) => set("icon", e.target.value)}
            className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-2xl"
            placeholder="🏷️" maxLength={4} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Color</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PALETTE.map((c) => (
              <button key={c} onClick={() => set("color", c)}
                className={`w-8 h-8 rounded-full transition-all ${form.color === c ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : "hover:scale-110"}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <button onClick={handleSubmit}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
          {category ? "Save Changes" : "Add Category"}
        </button>
      </div>
    </Modal>
  );
}

// ── VIEWS ──────────────────────────────────────────────────────────────────────
function DashboardView({ accounts, transactions, budgets, categories, currentMonth, onAddTx, onEditTx, onDeleteTx, onChangeMonth }) {
  const monthTxs = transactions.filter((t) => t.date.startsWith(currentMonth));
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const monthIncome  = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const monthExpense = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savings = monthIncome - monthExpense;

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const accMap = Object.fromEntries(accounts.map((a) => [a.id, a]));

  const monthBudgets = budgets.filter((b) => b.month === currentMonth);
  const budgetRows = monthBudgets
    .map((b) => {
      const cat = catMap[b.categoryId];
      const spent = monthTxs
        .filter((t) => t.type === "expense" && t.categoryId === b.categoryId)
        .reduce((s, t) => s + t.amount, 0);
      const pct = Math.min((spent / b.amount) * 100, 100);
      return { cat, spent, budget: b.amount, pct };
    })
    .filter((r) => r.cat);

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <MonthNav current={currentMonth} onChange={onChangeMonth} />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg col-span-1 sm:col-span-1">
          <p className="text-indigo-200 text-sm font-medium">Total Balance</p>
          <p className="text-3xl font-bold mt-1">{fmt(totalBalance)}</p>
          <p className="text-indigo-300 text-xs mt-2">{accounts.length} accounts</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-green-500" />
            <p className="text-gray-500 text-sm font-medium">Income</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{fmt(monthIncome)}</p>
          <p className="text-gray-400 text-xs mt-1">This month</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-red-500" />
            <p className="text-gray-500 text-sm font-medium">Expenses</p>
          </div>
          <p className="text-2xl font-bold text-red-500">{fmt(monthExpense)}</p>
          <p className="text-gray-400 text-xs mt-1">Saved: {fmt(savings)}</p>
        </div>
      </div>

      {/* Accounts row */}
      <div>
        <h3 className="text-gray-700 font-semibold mb-3">My Accounts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {accounts.map((a) => {
            const t = ACCOUNT_TYPES.find((t) => t.value === a.type);
            return (
              <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{t?.icon}</span>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                </div>
                <p className="text-xs text-gray-500 truncate">{a.name}</p>
                <p className="text-base font-bold text-gray-800 mt-0.5">{fmt(a.balance)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget overview */}
      {budgetRows.length > 0 && (
        <div>
          <h3 className="text-gray-700 font-semibold mb-3">Budget Overview</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            {budgetRows.slice(0, 5).map(({ cat, spent, budget, pct }) => (
              <div key={cat.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{fmt(spent)} / {fmt(budget)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? "#EF4444" : pct >= 70 ? "#F59E0B" : cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700 font-semibold">Recent Transactions</h3>
          <button onClick={onAddTx}
            className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
            <Plus size={15} /> Add
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {recent.map((t) => (
            <TxRow key={t.id} tx={t} catMap={catMap} accMap={accMap} onEdit={onEditTx} onDelete={onDeleteTx} />
          ))}
          {recent.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TransactionsView({ transactions, categories, accounts, currentMonth, setCurrentMonth, onAdd, onEdit, onDelete }) {
  const [search, setSearch]       = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState(0);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const accMap = Object.fromEntries(accounts.map((a) => [a.id, a]));

  const monthTxs = transactions.filter((t) => t.date.startsWith(currentMonth));
  const filtered = monthTxs
    .filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterCat && t.categoryId !== filterCat) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalIncome  = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const visibleCats = categories.filter((c) => filterType === "all" || c.type === filterType);

  return (
    <div className="space-y-4">
      <MonthNav current={currentMonth} onChange={setCurrentMonth} />

      {/* Month totals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
          <p className="text-xs text-green-600 font-medium">Month Income</p>
          <p className="text-lg font-bold text-green-700 mt-0.5">{fmt(totalIncome)}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
          <p className="text-xs text-red-600 font-medium">Month Expenses</p>
          <p className="text-lg font-bold text-red-600 mt-0.5">{fmt(totalExpense)}</p>
        </div>
      </div>

      {/* Search + type filter */}
      <div className="flex gap-2 flex-wrap">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          {["all", "expense", "income"].map((type) => (
            <button key={type} onClick={() => { setFilterType(type); setFilterCat(0); }}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors
                ${filterType === type ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button onClick={() => setFilterCat(0)}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors
            ${filterCat === 0 ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"}`}>
          All
        </button>
        {visibleCats.map((c) => (
          <button key={c.id} onClick={() => setFilterCat(c.id === filterCat ? 0 : c.id)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors
              ${filterCat === c.id ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            style={filterCat === c.id ? { backgroundColor: c.color, borderColor: c.color } : {}}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
        <button onClick={onAdd}
          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={15} /> Add Transaction
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {filtered.map((t) => (
          <TxRow key={t.id} tx={t} catMap={catMap} accMap={accMap} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">No transactions found</p>
        )}
      </div>
    </div>
  );
}

function AccountsView({ accounts, transactions, onAdd, onEdit, onDelete }) {
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Balance</p>
          <p className="text-2xl font-bold text-gray-800">{fmt(totalBalance)}</p>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={15} /> Add Account
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accounts.map((a) => {
          const t      = ACCOUNT_TYPES.find((t) => t.value === a.type);
          const txCount = transactions.filter((tx) => tx.accountId === a.id).length;
          const income = transactions.filter((tx) => tx.accountId === a.id && tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
          const expense= transactions.filter((tx) => tx.accountId === a.id && tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
          return (
            <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: a.color + "22" }}>
                    {t?.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-400">{t?.label} · {txCount} txns</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(a)} className="text-gray-300 hover:text-indigo-500 p-1 transition-colors"><Edit2 size={15} /></button>
                  <button onClick={() => onDelete(a.id)} className="text-gray-300 hover:text-red-500 p-1 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: a.color }}>{fmt(a.balance)}</p>
              <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">In</p>
                  <p className="text-sm font-semibold text-green-600">+{fmt(income)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Out</p>
                  <p className="text-sm font-semibold text-red-500">-{fmt(expense)}</p>
                </div>
              </div>
            </div>
          );
        })}
        {accounts.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">💳</p>
            <p>No accounts yet. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BudgetView({ budgets, categories, transactions, currentMonth, setCurrentMonth, onAdd, onEdit, onDelete }) {
  const monthTxs    = transactions.filter((t) => t.date.startsWith(currentMonth));
  const catMap      = Object.fromEntries(categories.map((c) => [c.id, c]));
  const monthBudgets= budgets.filter((b) => b.month === currentMonth);
  const totalBudget = monthBudgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent  = monthBudgets.reduce((s, b) => {
    return s + monthTxs.filter((t) => t.type === "expense" && t.categoryId === b.categoryId).reduce((x, t) => x + t.amount, 0);
  }, 0);

  return (
    <div className="space-y-4">
      <MonthNav current={currentMonth} onChange={setCurrentMonth} />

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs text-indigo-600 font-medium">Total Budget</p>
          <p className="text-xl font-bold text-indigo-700 mt-1">{fmt(totalBudget)}</p>
        </div>
        <div className={`rounded-xl p-4 border ${totalSpent > totalBudget ? "bg-red-50 border-red-100" : "bg-white border-gray-100"}`}>
          <p className={`text-xs font-medium ${totalSpent > totalBudget ? "text-red-600" : "text-gray-500"}`}>Total Spent</p>
          <p className={`text-xl font-bold mt-1 ${totalSpent > totalBudget ? "text-red-600" : "text-gray-800"}`}>{fmt(totalSpent)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{monthBudgets.length} budget{monthBudgets.length !== 1 ? "s" : ""}</p>
        <button onClick={onAdd}
          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={15} /> Add Budget
        </button>
      </div>

      <div className="space-y-3">
        {monthBudgets.map((b) => {
          const cat     = catMap[b.categoryId];
          if (!cat) return null;
          const spent   = monthTxs.filter((t) => t.type === "expense" && t.categoryId === b.categoryId).reduce((s, t) => s + t.amount, 0);
          const pct     = Math.min((spent / b.amount) * 100, 100);
          const remaining= b.amount - spent;
          const isOver  = spent > b.amount;
          const barColor= pct >= 100 ? "#EF4444" : pct >= 80 ? "#F59E0B" : cat.color;
          return (
            <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: cat.color + "22" }}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400">Budget: {fmt(b.amount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isOver ? "text-red-500" : "text-gray-700"}`}>{fmt(spent)}</p>
                    <p className={`text-xs ${isOver ? "text-red-400" : "text-gray-400"}`}>
                      {isOver ? `over ${fmt(-remaining)}` : `left ${fmt(remaining)}`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(b)} className="text-gray-300 hover:text-indigo-500 p-1 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => onDelete(b.id)} className="text-gray-300 hover:text-red-500 p-1 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: barColor }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-400">{Math.round(pct)}% used</span>
                <span className="text-xs" style={{ color: barColor }}>{isOver ? "Over budget!" : `${Math.round(100 - pct)}% left`}</span>
              </div>
            </div>
          );
        })}
        {monthBudgets.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <p className="text-5xl mb-3">📊</p>
            <p className="font-medium">No budgets for this month</p>
            <p className="text-sm mt-1">Tap "Add Budget" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatisticsView({ transactions, categories, currentMonth, setCurrentMonth }) {
  const monthTxs    = transactions.filter((t) => t.date.startsWith(currentMonth));
  const catMap      = Object.fromEntries(categories.map((c) => [c.id, c]));
  const monthIncome = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const monthExpense= monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savings     = monthIncome - monthExpense;

  // Pie data — expenses by category
  const expMap = {};
  monthTxs.filter((t) => t.type === "expense").forEach((t) => {
    expMap[t.categoryId] = (expMap[t.categoryId] || 0) + t.amount;
  });
  const pieData = Object.entries(expMap)
    .map(([id, value]) => {
      const cat = catMap[Number(id)];
      return { name: cat?.name || "Other", value, color: cat?.color || "#ccc", icon: cat?.icon || "💸" };
    })
    .sort((a, b) => b.value - a.value);

  // Income by category
  const incMap = {};
  monthTxs.filter((t) => t.type === "income").forEach((t) => {
    incMap[t.categoryId] = (incMap[t.categoryId] || 0) + t.amount;
  });
  const incData = Object.entries(incMap)
    .map(([id, value]) => {
      const cat = catMap[Number(id)];
      return { name: cat?.name || "Other", value, color: cat?.color || "#ccc", icon: cat?.icon || "💰" };
    })
    .sort((a, b) => b.value - a.value);

  // Last 6 months bar chart
  const last6 = [];
  for (let i = 5; i >= 0; i--) {
    const [y, mo] = currentMonth.split("-").map(Number);
    const d   = new Date(y, mo - 1 - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const txs = transactions.filter((t) => t.date.startsWith(key));
    last6.push({
      month:   d.toLocaleDateString("en", { month: "short" }),
      Income:  txs.filter((t) => t.type === "income").reduce((s, t)  => s + t.amount, 0),
      Expense: txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    });
  }

  return (
    <div className="space-y-6">
      <MonthNav current={currentMonth} onChange={setCurrentMonth} />

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <p className="text-xs text-green-600 font-medium">Income</p>
          <p className="text-base font-bold text-green-700 mt-0.5">{fmt(monthIncome)}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-xs text-red-600 font-medium">Expenses</p>
          <p className="text-base font-bold text-red-600 mt-0.5">{fmt(monthExpense)}</p>
        </div>
        <div className={`rounded-xl p-3 border ${savings >= 0 ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"}`}>
          <p className={`text-xs font-medium ${savings >= 0 ? "text-blue-600" : "text-orange-600"}`}>Savings</p>
          <p className={`text-base font-bold mt-0.5 ${savings >= 0 ? "text-blue-700" : "text-orange-600"}`}>{fmt(Math.abs(savings))}</p>
        </div>
      </div>

      {/* Savings rate */}
      {monthIncome > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">Savings Rate</p>
            <p className={`text-sm font-bold ${savings >= 0 ? "text-blue-600" : "text-red-500"}`}>
              {savings >= 0 ? ((savings / monthIncome) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min((savings / monthIncome) * 100, 100))}%` }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Expense pie */}
      {pieData.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Where Your Money Goes</h3>
          <div className="flex gap-4 items-center">
            <div style={{ width: 150, height: 150, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={2} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto max-h-44">
              {pieData.map((d, i) => {
                const pct = monthExpense > 0 ? ((d.value / monthExpense) * 100).toFixed(1) : 0;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-xs text-gray-700 truncate">{d.icon} {d.name}</span>
                        <span className="text-xs font-semibold text-gray-600 flex-shrink-0">{pct}%</span>
                      </div>
                      <div className="h-1 bg-gray-100 rounded-full mt-0.5">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center text-gray-400">
          <p className="text-3xl mb-2">📉</p>
          <p>No expenses recorded this month</p>
        </div>
      )}

      {/* 6-month bar chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">6-Month Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={last6} barGap={4}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
            <Tooltip formatter={(v) => fmt(v)}
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,.1)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Income"  fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense category detail */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
          <div className="space-y-3">
            {pieData.map((d, i) => {
              const pct = monthExpense > 0 ? ((d.value / monthExpense) * 100).toFixed(1) : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{d.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{d.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{pct}%</span>
                        <span className="text-sm font-bold text-gray-800">{fmt(d.value)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Income breakdown */}
      {incData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Income Sources</h3>
          <div className="space-y-3">
            {incData.map((d, i) => {
              const pct = monthIncome > 0 ? ((d.value / monthIncome) * 100).toFixed(1) : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{d.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{d.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{pct}%</span>
                        <span className="text-sm font-bold text-gray-800">{fmt(d.value)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoriesView({ categories, onAdd, onEdit, onDelete }) {
  const expense = categories.filter((c) => c.type === "expense");
  const income  = categories.filter((c) => c.type === "income");
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{categories.length} categories</p>
        <button onClick={onAdd}
          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={15} /> Add Category
        </button>
      </div>
      {[{ label: "Expense Categories", items: expense }, { label: "Income Categories", items: income }].map((g) => (
        <div key={g.label}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{g.label}</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {g.items.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 group transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: c.color + "22" }}>
                  {c.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs capitalize" style={{ color: c.color }}>{c.type}</p>
                </div>
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(c)} className="text-gray-300 hover:text-indigo-500 p-1 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => onDelete(c.id)} className="text-gray-300 hover:text-red-500 p-1 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {g.items.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-6">No {g.label.toLowerCase()} yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",    icon: Home,     label: "Dashboard"    },
  { id: "transactions", icon: List,     label: "Transactions" },
  { id: "accounts",     icon: Wallet,   label: "Accounts"     },
  { id: "budget",       icon: Tag,      label: "Budget"       },
  { id: "statistics",   icon: BarChart2,label: "Statistics"   },
  { id: "categories",   icon: Settings, label: "Categories"   },
];

export default function App() {
  const [view,         setView]         = useState("dashboard");
  const [accounts,     setAccounts]     = useState(initAccounts);
  const [categories,   setCategories]   = useState(initCategories);
  const [transactions, setTransactions] = useState(initTransactions);
  const [budgets,      setBudgets]      = useState(initBudgets);
  const [currentMonth, setCurrentMonth] = useState("2026-04");

  const [txModal,     setTxModal]     = useState(null); // null | "new" | tx object
  const [accModal,    setAccModal]    = useState(null);
  const [budgetModal, setBudgetModal] = useState(null);
  const [catModal,    setCatModal]    = useState(null);

  // ── CRUD helpers ─────────────────────────────────────────────
  const upsert = (setter) => (item) =>
    setter((prev) => prev.find((x) => x.id === item.id) ? prev.map((x) => x.id === item.id ? item : x) : [...prev, item]);

  const saveTx = (tx) => { upsert(setTransactions)(tx); setTxModal(null); };
  const saveAcc= (a)  => { upsert(setAccounts)(a);      setAccModal(null); };
  const saveBudget = (b) => { upsert(setBudgets)(b);    setBudgetModal(null); };
  const saveCat= (c)  => { upsert(setCategories)(c);    setCatModal(null); };

  const deleteTx     = (id) => setTransactions((p) => p.filter((x) => x.id !== id));
  const deleteAcc    = (id) => setAccounts((p)     => p.filter((x) => x.id !== id));
  const deleteBudget = (id) => setBudgets((p)      => p.filter((x) => x.id !== id));
  const deleteCat    = (id) => setCategories((p)   => p.filter((x) => x.id !== id));

  const active = NAV.find((n) => n.id === view);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-16 sm:w-56 bg-indigo-700 flex flex-col py-5 flex-shrink-0 shadow-xl">
        <div className="px-4 mb-6 hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">BudgetMe</h1>
              <p className="text-indigo-300 text-xs">Smart Tracker</p>
            </div>
          </div>
        </div>
        <div className="sm:hidden flex justify-center mb-4">
          <span className="text-2xl">💰</span>
        </div>
        <nav className="flex flex-col px-2 sm:px-3 gap-0.5 flex-1">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setView(id)}
              className={`flex items-center gap-3 px-3 py-2.�25 rounded-xl transition-all text-left
                ${view === id
                  ? "bg-white text-indigo-700 font-semibold shadow-sm"
                  : "text-indigo-200 hover:bg-indigo-600 hover:text-white"}`}>
              <Icon size={19} className="flex-shrink-0" />
              <span className="hidden sm:block text-sm">{label}</span>
            </button>
          ))}
        </nav>
        <p className="hidden sm:block text-indigo-400 text-xs text-center px-3 mt-4">
          Data is in-session only
        </p>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-800">{active?.label}</h2>
          </div>

          {view === "dashboard" && (
            <DashboardView
              accounts={accounts} transactions={transactions} budgets={budgets} categories={categories}
              currentMonth={currentMonth} onChangeMonth={setCurrentMonth}
              onAddTx={() => setTxModal("new")} onEditTx={setTxModal} onDeleteTx={deleteTx}
            />
          )}
          {view === "transactions" && (
            <TransactionsView
              transactions={transactions} categories={categories} accounts={accounts}
              currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}
              onAdd={() => setTxModal("new")} onEdit={setTxModal} onDelete={deleteTx}
            />
          )}
          {view === "accounts" && (
            <AccountsView
              accounts={accounts} transactions={transactions}
              onAdd={() => setAccModal("new")} onEdit={setAccModal} onDelete={deleteAcc}
            />
          )}
          {view === "budget" && (
            <BudgetView
              budgets={budgets} categories={categories} transactions={transactions}
              currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}
              onAdd={() => setBudgetModal("new")} onEdit={setBudgetModal} onDelete={deleteBudget}
            />
          )}
          {view === "statistics" && (
            <StatisticsView
              transactions={transactions} categories={categories}
              currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}
            />
          )}
          {view === "categories" && (
            <CategoriesView
              categories={categories}
              onAdd={() => setCatModal("new")} onEdit={setCatModal} onDelete={deleteCat}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {txModal && (
        <TransactionModal
          tx={txModal === "new" ? null : txModal}
          categories={categories} accounts={accounts}
          onSave={saveTx} onClose={() => setTxModal(null)}
        />
      )}
      {accModal && (
        <AccountModal
          account={accModal === "new" ? null : accModal}
          onSave={saveAcc} onClose={() => setAccModal(null)}
        />
      )}
      {budgetModal && (
        <BudgetModal
          budget={budgetModal === "new" ? null : budgetModal}
          categories={categories} currentMonth={currentMonth}
          onSave={saveBudget} onClose={() => setBudgetModal(null)}
        />
      )}
      {catModal && (
        <CategoryModal
          category={catModal === "new" ? null : catModal}
          onSave={saveCat} onClose={() => setCatModal(null)}
        />
      )}
    </div>
  );
}
