import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  Plus, Edit2, Trash2, X, TrendingUp, TrendingDown,
  Home, List, Wallet, BarChart2, Tag, ChevronDown, ChevronUp,
  Calendar, Brain, ArrowRightLeft, RefreshCw,
} from "lucide-react";

const CURRENCY = "₱";
const PALETTE = [
  "#6366F1","#8B5CF6","#EC4899","#EF4444","#F59E0B",
  "#10B981","#14B8A6","#3B82F6","#84CC16","#F97316",
  "#06B6D4","#D946EF","#F43F5E","#A855F7","#22C55E","#0EA5E9",
];

const fmt = (n) =>
  `${CURRENCY}${Number(n||0).toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

const fmtDate = (d) => {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en",{weekday:"short",month:"short",day:"numeric",year:"numeric"});
};

let _id = 400;
const newId = () => ++_id;

// ── INITIAL DATA ────────────────────────────────────────────────────────────
const INIT_TX = [{"id":1,"date":"2026-04-12","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":1434.5,"note":""},{"id":2,"date":"2026-04-12","account":"Maya","category":"Bills","subcategory":"Kocco","type":"expense","amount":111.5,"note":""},{"id":3,"date":"2026-04-12","account":"Maya","category":"🚖 Transport","subcategory":"Car","type":"expense","amount":111.5,"note":""},{"id":4,"date":"2026-04-12","account":"Cash","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":540.0,"note":""},{"id":5,"date":"2026-04-11","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":412.5,"note":""},{"id":6,"date":"2026-04-11","account":"Cash","category":"Pauliney❤️","subcategory":"","type":"expense","amount":235.0,"note":""},{"id":7,"date":"2026-04-11","account":"Cash","category":"🍜 Food","subcategory":"Dessert","type":"expense","amount":250.0,"note":""},{"id":8,"date":"2026-04-11","account":"UnionB","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":100.0,"note":""},{"id":9,"date":"2026-04-10","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":411.0,"note":""},{"id":10,"date":"2026-04-10","account":"UnionB","category":"🧥 Apparel","subcategory":"Others","type":"expense","amount":123.0,"note":""},{"id":11,"date":"2026-04-10","account":"UnionB","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":100.0,"note":""},{"id":12,"date":"2026-04-10","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":941.88,"note":""},{"id":13,"date":"2026-04-10","account":"Cash","category":"🎁 Gift","subcategory":"","type":"expense","amount":195.0,"note":""},{"id":14,"date":"2026-04-10","account":"Cash","category":"Pauliney❤️","subcategory":"","type":"expense","amount":195.0,"note":""},{"id":15,"date":"2026-04-10","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":225.0,"note":""},{"id":16,"date":"2026-04-09","account":"GCash","category":"RCBC","subcategory":"","type":"transfer_in","amount":1700.0,"note":""},{"id":17,"date":"2026-04-09","account":"RCBC","category":"GCash","subcategory":"","type":"transfer_out","amount":1700.0,"note":""},{"id":18,"date":"2026-04-09","account":"RCBC","category":"🧘🏼 Subscription","subcategory":"ClaudeAi","type":"expense","amount":1310.0,"note":""},{"id":19,"date":"2026-04-08","account":"GCash","category":"Bills","subcategory":"Parents","type":"expense","amount":250.0,"note":""},{"id":20,"date":"2026-04-08","account":"UnionB","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":100.0,"note":""},{"id":21,"date":"2026-04-08","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":397.95,"note":""},{"id":22,"date":"2026-04-08","account":"UnionB","category":"Gadget","subcategory":"Accessories","type":"expense","amount":280.0,"note":""},{"id":23,"date":"2026-04-08","account":"MariBank","category":"Bank","subcategory":"Fees","type":"expense","amount":49.0,"note":""},{"id":24,"date":"2026-04-08","account":"GCash","category":"🧥 Apparel","subcategory":"Others","type":"expense","amount":15.0,"note":"GCash → MariBank"},{"id":25,"date":"2026-04-08","account":"MariBank","category":"GCash","subcategory":"","type":"transfer_in","amount":500.0,"note":""},{"id":26,"date":"2026-04-08","account":"GCash","category":"MariBank","subcategory":"","type":"transfer_out","amount":500.0,"note":""},{"id":27,"date":"2026-04-08","account":"UnionB","category":"Reset","subcategory":"","type":"expense","amount":8990.15,"note":""},{"id":28,"date":"2026-04-08","account":"SecBank","category":"UnionB","subcategory":"","type":"transfer_in","amount":2196.4,"note":""},{"id":29,"date":"2026-04-08","account":"UnionB","category":"SecBank","subcategory":"","type":"transfer_out","amount":2196.4,"note":""},{"id":30,"date":"2026-04-08","account":"UnionB","category":"BDO","subcategory":"","type":"transfer_in","amount":2010.0,"note":""},{"id":31,"date":"2026-04-08","account":"BDO","category":"UnionB","subcategory":"","type":"transfer_out","amount":2010.0,"note":""},{"id":32,"date":"2026-04-08","account":"GCash","category":"UnionB","subcategory":"","type":"transfer_in","amount":1421.0,"note":""},{"id":33,"date":"2026-04-08","account":"UnionB","category":"GCash","subcategory":"","type":"transfer_out","amount":1421.0,"note":""},{"id":34,"date":"2026-04-07","account":"Cash","category":"UnionB","subcategory":"","type":"transfer_in","amount":2785.0,"note":""},{"id":35,"date":"2026-04-07","account":"UnionB","category":"Cash","subcategory":"","type":"transfer_out","amount":2785.0,"note":""},{"id":36,"date":"2026-04-07","account":"Maya","category":"UnionB","subcategory":"","type":"transfer_in","amount":4909.85,"note":""},{"id":37,"date":"2026-04-07","account":"UnionB","category":"Maya","subcategory":"","type":"transfer_out","amount":4909.85,"note":""},{"id":38,"date":"2026-04-07","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":8000.0,"note":""},{"id":39,"date":"2026-04-07","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":1909.65,"note":""},{"id":40,"date":"2026-04-07","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":19096.51,"note":""},{"id":41,"date":"2026-04-07","account":"UnionB","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":220.0,"note":""},{"id":42,"date":"2026-04-05","account":"UnionB","category":"🚖 Transport","subcategory":"Car","type":"expense","amount":119.5,"note":""},{"id":43,"date":"2026-04-05","account":"UnionB","category":"Personal","subcategory":"Health","type":"expense","amount":682.0,"note":""},{"id":44,"date":"2026-04-05","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":114.5,"note":""},{"id":45,"date":"2026-04-05","account":"UnionB","category":"Bills","subcategory":"Kocco","type":"expense","amount":369.5,"note":""},{"id":46,"date":"2026-04-05","account":"UnionB","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":250.0,"note":""},{"id":47,"date":"2026-04-04","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":953.34,"note":""},{"id":48,"date":"2026-04-04","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":476.67,"note":""},{"id":49,"date":"2026-04-04","account":"UnionB","category":"Pauliney❤️","subcategory":"","type":"expense","amount":1992.0,"note":""},{"id":50,"date":"2026-04-03","account":"UnionB","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":50.0,"note":""},{"id":51,"date":"2026-04-03","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":909.0,"note":""},{"id":52,"date":"2026-04-03","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":1190.6,"note":""},{"id":53,"date":"2026-04-03","account":"UnionB","category":"🍜 Food","subcategory":"Restaurants ","type":"expense","amount":595.3,"note":""},{"id":54,"date":"2026-04-03","account":"UnionB","category":"Pauliney❤️","subcategory":"","type":"expense","amount":595.3,"note":""},{"id":55,"date":"2026-04-03","account":"UnionB","category":"🚖 Transport","subcategory":"Bike","type":"expense","amount":136.0,"note":""},{"id":56,"date":"2026-04-01","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":266.0,"note":""},{"id":57,"date":"2026-04-01","account":"UnionB","category":"Gadget","subcategory":"Phone","type":"expense","amount":3700.0,"note":""},{"id":58,"date":"2026-04-01","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":5200.0,"note":""},{"id":59,"date":"2026-04-01","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":1914.36,"note":""},{"id":60,"date":"2026-04-01","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":19143.63,"note":""},{"id":61,"date":"2026-03-29","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":225.0,"note":""},{"id":62,"date":"2026-03-29","account":"UnionB","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":622.0,"note":""},{"id":63,"date":"2026-03-28","account":"UnionB","category":"Personal","subcategory":"Fun","type":"expense","amount":850.0,"note":""},{"id":64,"date":"2026-03-28","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":390.0,"note":""},{"id":65,"date":"2026-03-28","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":245.75,"note":""},{"id":66,"date":"2026-03-28","account":"UnionB","category":"🚖 Transport","subcategory":"Car","type":"expense","amount":42.25,"note":""},{"id":67,"date":"2026-03-28","account":"UnionB","category":"🚖 Transport","subcategory":"Bike","type":"expense","amount":210.0,"note":""},{"id":68,"date":"2026-03-28","account":"UnionB","category":"🍜 Food","subcategory":"","type":"expense","amount":775.0,"note":""},{"id":69,"date":"2026-03-27","account":"Cash","category":"Personal","subcategory":"Haircut","type":"expense","amount":150.0,"note":""},{"id":70,"date":"2026-03-27","account":"UnionB","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":350.0,"note":""},{"id":71,"date":"2026-03-27","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":276.67,"note":""},{"id":72,"date":"2026-03-27","account":"UnionB","category":"Pauliney❤️","subcategory":"","type":"expense","amount":396.17,"note":""},{"id":73,"date":"2026-03-27","account":"Maya","category":"🧘🏼 Subscription","subcategory":"Load","type":"expense","amount":99.0,"note":""},{"id":74,"date":"2026-03-27","account":"Cash","category":"🍜 Food","subcategory":"Beverages","type":"expense","amount":120.0,"note":""},{"id":75,"date":"2026-03-27","account":"Cash","category":"🍜 Food","subcategory":"Dessert","type":"expense","amount":250.0,"note":""},{"id":76,"date":"2026-03-27","account":"UnionB","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":276.67,"note":""},{"id":77,"date":"2026-03-27","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":260.0,"note":""},{"id":78,"date":"2026-03-27","account":"Cash","category":"Bills","subcategory":"Parents","type":"expense","amount":1000.0,"note":""},{"id":79,"date":"2026-03-25","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":45.0,"note":""},{"id":80,"date":"2026-03-25","account":"UnionB","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":170.0,"note":""},{"id":81,"date":"2026-03-25","account":"Cash","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":230.0,"note":""},{"id":82,"date":"2026-03-25","account":"Cash","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":140.0,"note":""},{"id":83,"date":"2026-03-25","account":"BDO","category":"UnionB","subcategory":"","type":"transfer_in","amount":1688.55,"note":""},{"id":84,"date":"2026-03-25","account":"UnionB","category":"BDO","subcategory":"","type":"transfer_out","amount":1688.55,"note":""},{"id":85,"date":"2026-03-25","account":"UnionB","category":"SecBank","subcategory":"","type":"transfer_in","amount":4089.02,"note":""},{"id":86,"date":"2026-03-25","account":"SecBank","category":"UnionB","subcategory":"","type":"transfer_out","amount":4089.02,"note":""},{"id":87,"date":"2026-03-25","account":"Cash","category":"UnionB","subcategory":"","type":"transfer_in","amount":269.0,"note":""},{"id":88,"date":"2026-03-25","account":"UnionB","category":"Cash","subcategory":"","type":"transfer_out","amount":269.0,"note":""},{"id":89,"date":"2026-03-25","account":"SecBank","category":"RCBC","subcategory":"","type":"transfer_in","amount":1503.02,"note":""},{"id":90,"date":"2026-03-25","account":"RCBC","category":"SecBank","subcategory":"","type":"transfer_out","amount":1503.02,"note":""},{"id":91,"date":"2026-03-25","account":"GCash","category":"UnionB","subcategory":"","type":"transfer_in","amount":349.32,"note":""},{"id":92,"date":"2026-03-25","account":"UnionB","category":"GCash","subcategory":"","type":"transfer_out","amount":349.32,"note":""},{"id":93,"date":"2026-03-25","account":"UnionB","category":"🧥 Apparel","subcategory":"Others","type":"expense","amount":10.0,"note":"UnionB → Maya"},{"id":94,"date":"2026-03-25","account":"Maya","category":"UnionB","subcategory":"","type":"transfer_in","amount":27993.95,"note":""},{"id":95,"date":"2026-03-25","account":"UnionB","category":"Maya","subcategory":"","type":"transfer_out","amount":27993.95,"note":""},{"id":96,"date":"2026-03-25","account":"UnionB","category":"🚖 Transport","subcategory":"Bike","type":"expense","amount":151.0,"note":""},{"id":97,"date":"2026-03-24","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":1899.9,"note":""},{"id":98,"date":"2026-03-24","account":"UnionB","category":"🍜 Food","subcategory":"Street Food","type":"expense","amount":245.0,"note":""},{"id":99,"date":"2026-03-24","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":4500.0,"note":""},{"id":100,"date":"2026-03-24","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":18998.97,"note":""},{"id":101,"date":"2026-03-23","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":938.5,"note":""},{"id":102,"date":"2026-03-23","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":1700.0,"note":""},{"id":103,"date":"2026-03-22","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":728.16,"note":""},{"id":104,"date":"2026-03-22","account":"UnionB","category":"Bills","subcategory":"Kocco","type":"expense","amount":121.0,"note":""},{"id":105,"date":"2026-03-22","account":"UnionB","category":"🚖 Transport","subcategory":"Car","type":"expense","amount":121.0,"note":""},{"id":106,"date":"2026-03-22","account":"UnionB","category":"🍜 Food","subcategory":"Restaurants ","type":"expense","amount":242.72,"note":""},{"id":107,"date":"2026-03-22","account":"UnionB","category":"Pauliney❤️","subcategory":"","type":"expense","amount":355.0,"note":""},{"id":108,"date":"2026-03-22","account":"UnionB","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":100.0,"note":""},{"id":109,"date":"2026-03-21","account":"GCash","category":"Pauliney❤️","subcategory":"","type":"expense","amount":50.0,"note":""},{"id":110,"date":"2026-03-21","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":1889.06,"note":""},{"id":111,"date":"2026-03-21","account":"UnionB","category":"Gadget","subcategory":"Accessories","type":"expense","amount":100.0,"note":""},{"id":112,"date":"2026-03-21","account":"UnionB","category":"🚖 Transport","subcategory":"Car","type":"expense","amount":165.0,"note":""},{"id":113,"date":"2026-03-21","account":"UnionB","category":"🚖 Transport","subcategory":"Bus","type":"expense","amount":543.34,"note":""},{"id":114,"date":"2026-03-21","account":"UnionB","category":"🚖 Transport","subcategory":"Bus","type":"expense","amount":271.67,"note":""},{"id":115,"date":"2026-03-21","account":"UnionB","category":"🍜 Food","subcategory":"Beverages","type":"expense","amount":50.0,"note":""},{"id":116,"date":"2026-03-20","account":"Maya","category":"RCBC","subcategory":"","type":"transfer_in","amount":7000.0,"note":""},{"id":117,"date":"2026-03-20","account":"RCBC","category":"Maya","subcategory":"","type":"transfer_out","amount":7000.0,"note":""},{"id":118,"date":"2026-03-20","account":"GCash","category":"🧘🏼 Subscription","subcategory":"Load","type":"expense","amount":99.0,"note":""},{"id":119,"date":"2026-03-20","account":"UnionB","category":"🧘🏼 Subscription","subcategory":"Gym","type":"expense","amount":2650.0,"note":""},{"id":120,"date":"2026-03-20","account":"SecBank","category":"Gadget","subcategory":"Laptop","type":"expense","amount":2800.0,"note":""},{"id":121,"date":"2026-03-20","account":"UnionB","category":"Gadget","subcategory":"Phone","type":"expense","amount":3700.0,"note":""},{"id":122,"date":"2026-03-19","account":"GCash","category":"🍜 Food","subcategory":"Beverages","type":"expense","amount":100.0,"note":""},{"id":123,"date":"2026-03-19","account":"GCash","category":"🎁 Gift","subcategory":"","type":"expense","amount":80.0,"note":""},{"id":124,"date":"2026-03-19","account":"GCash","category":"Pauliney❤️","subcategory":"","type":"expense","amount":285.0,"note":""},{"id":125,"date":"2026-03-19","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":215.0,"note":""},{"id":126,"date":"2026-03-18","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":1050.0,"note":""},{"id":127,"date":"2026-03-17","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":1515.0,"note":""},{"id":128,"date":"2026-03-17","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":4795.04,"note":""},{"id":129,"date":"2026-03-17","account":"UnionB","category":"More Staffing","subcategory":"Bonus","type":"income","amount":29000.0,"note":""},{"id":130,"date":"2026-03-17","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":18950.43,"note":""},{"id":131,"date":"2026-03-15","account":"UnionB","category":"Pauliney❤️","subcategory":"","type":"expense","amount":2323.0,"note":""},{"id":132,"date":"2026-03-14","account":"Cash","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":70.0,"note":""},{"id":133,"date":"2026-03-14","account":"Maya","category":"🧘🏼 Subscription","subcategory":"ChatGPT","type":"expense","amount":150.0,"note":""},{"id":134,"date":"2026-03-14","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":130.0,"note":""},{"id":135,"date":"2026-03-14","account":"Cash","category":"🧘🏼 Subscription","subcategory":"Gym","type":"expense","amount":130.0,"note":""},{"id":136,"date":"2026-03-14","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":1497.15,"note":""},{"id":137,"date":"2026-03-12","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":2310.0,"note":""},{"id":138,"date":"2026-03-11","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":555.0,"note":""},{"id":139,"date":"2026-03-10","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":1869.9,"note":""},{"id":140,"date":"2026-03-10","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":18698.96,"note":""},{"id":141,"date":"2026-03-09","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":4020.0,"note":""},{"id":142,"date":"2026-03-09","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":300.0,"note":""},{"id":143,"date":"2026-03-09","account":"UnionB","category":"Personal","subcategory":"Toiletries","type":"expense","amount":500.0,"note":""},{"id":144,"date":"2026-03-08","account":"UnionB","category":"🚖 Transport","subcategory":"Car","type":"expense","amount":135.5,"note":""},{"id":145,"date":"2026-03-08","account":"Cash","category":"Bills","subcategory":"Parents","type":"expense","amount":500.0,"note":""},{"id":146,"date":"2026-03-08","account":"Cash","category":"🚖 Transport","subcategory":"Bus","type":"expense","amount":250.0,"note":""},{"id":147,"date":"2026-03-08","account":"Cash","category":"Bills","subcategory":"Kocco","type":"expense","amount":75.0,"note":""},{"id":148,"date":"2026-03-08","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":120.0,"note":""},{"id":149,"date":"2026-03-07","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":2303.26,"note":""},{"id":150,"date":"2026-03-06","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":1500.0,"note":""},{"id":151,"date":"2026-03-05","account":"Maya","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":125.0,"note":""},{"id":152,"date":"2026-03-05","account":"UnionB","category":"Gadget","subcategory":"Accessories","type":"expense","amount":1543.5,"note":"Massage gun"},{"id":153,"date":"2026-03-05","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":500.0,"note":""},{"id":154,"date":"2026-03-04","account":"RCBC","category":"UnionB","subcategory":"","type":"transfer_in","amount":4000.0,"note":""},{"id":155,"date":"2026-03-04","account":"UnionB","category":"RCBC","subcategory":"","type":"transfer_out","amount":4000.0,"note":""},{"id":156,"date":"2026-03-03","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":5000.0,"note":""},{"id":157,"date":"2026-03-03","account":"UnionB","category":"Gadget","subcategory":"Phone","type":"expense","amount":3710.0,"note":""},{"id":158,"date":"2026-03-03","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":1906.51,"note":""},{"id":159,"date":"2026-03-03","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":19065.07,"note":""},{"id":160,"date":"2026-03-02","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":1010.64,"note":""},{"id":161,"date":"2026-03-02","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":236.5,"note":""},{"id":162,"date":"2026-03-01","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":95.0,"note":""},{"id":163,"date":"2026-03-01","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":249.0,"note":""},{"id":164,"date":"2026-03-01","account":"Cash","category":"🎁 Gift","subcategory":"","type":"expense","amount":549.0,"note":""},{"id":165,"date":"2026-03-01","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":200.0,"note":""},{"id":166,"date":"2026-03-01","account":"UnionB","category":"GCash","subcategory":"","type":"transfer_in","amount":2325.16,"note":""},{"id":167,"date":"2026-03-01","account":"GCash","category":"UnionB","subcategory":"","type":"transfer_out","amount":2325.16,"note":""},{"id":168,"date":"2026-03-01","account":"UnionB","category":"RCBC","subcategory":"","type":"transfer_in","amount":135.38,"note":""},{"id":169,"date":"2026-03-01","account":"RCBC","category":"UnionB","subcategory":"","type":"transfer_out","amount":135.38,"note":""},{"id":170,"date":"2026-03-01","account":"SecBank","category":"RCBC","subcategory":"","type":"transfer_in","amount":4561.44,"note":""},{"id":171,"date":"2026-03-01","account":"RCBC","category":"SecBank","subcategory":"","type":"transfer_out","amount":4561.44,"note":""},{"id":172,"date":"2026-03-01","account":"Cash","category":"RCBC","subcategory":"","type":"transfer_in","amount":1500.0,"note":""},{"id":173,"date":"2026-03-01","account":"RCBC","category":"Cash","subcategory":"","type":"transfer_out","amount":1500.0,"note":""},{"id":174,"date":"2026-03-01","account":"Maya","category":"UnionB","subcategory":"","type":"transfer_in","amount":10003.06,"note":""},{"id":175,"date":"2026-03-01","account":"UnionB","category":"Maya","subcategory":"","type":"transfer_out","amount":10003.06,"note":""},{"id":176,"date":"2026-03-01","account":"Cash","category":"UnionB","subcategory":"","type":"transfer_in","amount":260.01,"note":""},{"id":177,"date":"2026-03-01","account":"UnionB","category":"Cash","subcategory":"","type":"transfer_out","amount":260.01,"note":""},{"id":178,"date":"2026-03-01","account":"Cash","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":50.0,"note":""},{"id":179,"date":"2026-03-01","account":"UnionB","category":"Bills","subcategory":"Kocco","type":"expense","amount":136.0,"note":""},{"id":180,"date":"2026-03-01","account":"Maya","category":"🚖 Transport","subcategory":"Car","type":"expense","amount":136.0,"note":""},{"id":181,"date":"2026-02-28","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":985.0,"note":""},{"id":182,"date":"2026-02-28","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":1045.0,"note":""},{"id":183,"date":"2026-02-27","account":"UnionB","category":"Pauliney❤️","subcategory":"","type":"expense","amount":195.0,"note":""},{"id":184,"date":"2026-02-27","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":723.4,"note":""},{"id":185,"date":"2026-02-27","account":"UnionB","category":"Gadget","subcategory":"Phone","type":"expense","amount":3710.0,"note":""},{"id":186,"date":"2026-02-26","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":145.0,"note":""},{"id":187,"date":"2026-02-26","account":"UnionB","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":170.0,"note":""},{"id":188,"date":"2026-02-26","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":1400.0,"note":""},{"id":189,"date":"2026-02-26","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":14000.0,"note":""},{"id":190,"date":"2026-02-25","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":5110.0,"note":""},{"id":191,"date":"2026-02-25","account":"SecBank","category":"Gadget","subcategory":"Laptop","type":"expense","amount":2800.0,"note":""},{"id":192,"date":"2026-02-25","account":"SecBank","category":"🧘🏼 Subscription","subcategory":"Gym","type":"expense","amount":2650.0,"note":""},{"id":193,"date":"2026-02-25","account":"Cash","category":"UnionB","subcategory":"","type":"transfer_in","amount":2558.58,"note":""},{"id":194,"date":"2026-02-25","account":"UnionB","category":"Cash","subcategory":"","type":"transfer_out","amount":2558.58,"note":""},{"id":195,"date":"2026-02-25","account":"GCash","category":"UnionB","subcategory":"","type":"transfer_in","amount":3155.0,"note":""},{"id":196,"date":"2026-02-25","account":"UnionB","category":"GCash","subcategory":"","type":"transfer_out","amount":3155.0,"note":""},{"id":197,"date":"2026-02-25","account":"Maya","category":"BDO","subcategory":"","type":"transfer_in","amount":5481.74,"note":""},{"id":198,"date":"2026-02-25","account":"BDO","category":"Maya","subcategory":"","type":"transfer_out","amount":5481.74,"note":""},{"id":199,"date":"2026-02-24","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":130.0,"note":""},{"id":200,"date":"2026-02-24","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":3510.0,"note":""},{"id":201,"date":"2026-02-24","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":1829.69,"note":""},{"id":202,"date":"2026-02-24","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":18296.9,"note":""},{"id":203,"date":"2026-02-23","account":"GCash","category":"Bills","subcategory":"Parents","type":"expense","amount":1500.0,"note":""},{"id":204,"date":"2026-02-22","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":285.47,"note":""},{"id":205,"date":"2026-02-22","account":"Cash","category":"🍜 Food","subcategory":"Beverages","type":"expense","amount":120.0,"note":""},{"id":206,"date":"2026-02-22","account":"Maya","category":"🚖 Transport","subcategory":"Car","type":"expense","amount":213.75,"note":""},{"id":207,"date":"2026-02-22","account":"Maya","category":"Bills","subcategory":"Kocco","type":"expense","amount":509.22,"note":""},{"id":208,"date":"2026-02-21","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":864.5,"note":""},{"id":209,"date":"2026-02-21","account":"UnionB","category":"🧥 Apparel","subcategory":"Others","type":"expense","amount":200.0,"note":"Umbrella"},{"id":210,"date":"2026-02-21","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":250.0,"note":""},{"id":211,"date":"2026-02-21","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":250.0,"note":""},{"id":212,"date":"2026-02-21","account":"UnionB","category":"🧥 Apparel","subcategory":"Clothing","type":"expense","amount":1050.0,"note":""},{"id":213,"date":"2026-02-21","account":"UnionB","category":"Pauliney❤️","subcategory":"","type":"expense","amount":1380.0,"note":""},{"id":214,"date":"2026-02-21","account":"UnionB","category":"Personal","subcategory":"Health","type":"expense","amount":1600.0,"note":"Glasses"},{"id":215,"date":"2026-02-20","account":"GCash","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":125.0,"note":""},{"id":216,"date":"2026-02-20","account":"GCash","category":"🍜 Food","subcategory":"Restaurants ","type":"expense","amount":649.0,"note":""},{"id":217,"date":"2026-02-20","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":158.0,"note":""},{"id":218,"date":"2026-02-20","account":"Cash","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":100.0,"note":""},{"id":219,"date":"2026-02-19","account":"GCash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":55.0,"note":""},{"id":220,"date":"2026-02-19","account":"GCash","category":"🎁 Gift","subcategory":"","type":"expense","amount":55.0,"note":""},{"id":221,"date":"2026-02-19","account":"BDO","category":"RCBC","subcategory":"","type":"transfer_in","amount":6985.4,"note":""},{"id":222,"date":"2026-02-19","account":"RCBC","category":"BDO","subcategory":"","type":"transfer_out","amount":6985.4,"note":""},{"id":223,"date":"2026-02-19","account":"Cash","category":"Maya","subcategory":"","type":"transfer_in","amount":60.88,"note":""},{"id":224,"date":"2026-02-19","account":"Maya","category":"Cash","subcategory":"","type":"transfer_out","amount":60.88,"note":""},{"id":225,"date":"2026-02-19","account":"SecBank","category":"RCBC","subcategory":"","type":"transfer_in","amount":1000.26,"note":""},{"id":226,"date":"2026-02-19","account":"RCBC","category":"SecBank","subcategory":"","type":"transfer_out","amount":1000.26,"note":""},{"id":227,"date":"2026-02-19","account":"UnionB","category":"RCBC","subcategory":"","type":"transfer_in","amount":775.9,"note":""},{"id":228,"date":"2026-02-19","account":"RCBC","category":"UnionB","subcategory":"","type":"transfer_out","amount":775.9,"note":""},{"id":229,"date":"2026-02-19","account":"GCash","category":"RCBC","subcategory":"","type":"transfer_in","amount":341.94,"note":""},{"id":230,"date":"2026-02-19","account":"RCBC","category":"GCash","subcategory":"","type":"transfer_out","amount":341.94,"note":""},{"id":231,"date":"2026-02-18","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":1055.0,"note":""},{"id":232,"date":"2026-02-18","account":"Maya","category":"Personal","subcategory":"Load","type":"expense","amount":99.0,"note":""},{"id":233,"date":"2026-02-18","account":"RCBC","category":"Bills","subcategory":"Parents","type":"expense","amount":196.5,"note":""},{"id":234,"date":"2026-02-18","account":"RCBC","category":"Pauliney❤️","subcategory":"","type":"expense","amount":196.5,"note":""},{"id":235,"date":"2026-02-18","account":"RCBC","category":"Date❤️","subcategory":"","type":"expense","amount":373.5,"note":""},{"id":236,"date":"2026-02-18","account":"RCBC","category":"Pauliney❤️","subcategory":"","type":"expense","amount":130.0,"note":""},{"id":237,"date":"2026-02-18","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":310.0,"note":""},{"id":238,"date":"2026-02-18","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":3695.0,"note":""},{"id":239,"date":"2026-02-17","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":3000.0,"note":""},{"id":240,"date":"2026-02-17","account":"Cash","category":"📙 Work Stuff","subcategory":"Materials ","type":"expense","amount":100.0,"note":""},{"id":241,"date":"2026-02-17","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":190.0,"note":""},{"id":242,"date":"2026-02-17","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":18380.93,"note":""},{"id":243,"date":"2026-02-16","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":144.0,"note":""},{"id":244,"date":"2026-02-16","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":135.0,"note":""},{"id":245,"date":"2026-02-15","account":"UnionB","category":"🚖 Transport","subcategory":"Bike","type":"expense","amount":71.0,"note":""},{"id":246,"date":"2026-02-15","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":130.0,"note":""},{"id":247,"date":"2026-02-15","account":"Cash","category":"Pauliney❤️","subcategory":"","type":"expense","amount":395.0,"note":""},{"id":248,"date":"2026-02-15","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":1303.52,"note":""},{"id":249,"date":"2026-02-15","account":"UnionB","category":"🍜 Food","subcategory":"Restaurants ","type":"expense","amount":651.76,"note":""},{"id":250,"date":"2026-02-14","account":"Cash","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":500.0,"note":""},{"id":251,"date":"2026-02-14","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":501.0,"note":""},{"id":252,"date":"2026-02-14","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":4375.95,"note":""},{"id":253,"date":"2026-02-14","account":"Cash","category":"Personal","subcategory":"Medicine","type":"expense","amount":85.0,"note":""},{"id":254,"date":"2026-02-13","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":190.0,"note":""},{"id":255,"date":"2026-02-12","account":"UnionB","category":"RCBC","subcategory":"","type":"transfer_in","amount":1772.41,"note":""},{"id":256,"date":"2026-02-12","account":"RCBC","category":"UnionB","subcategory":"","type":"transfer_out","amount":1772.41,"note":""},{"id":257,"date":"2026-02-12","account":"SecBank","category":"RCBC","subcategory":"","type":"transfer_in","amount":5279.0,"note":""},{"id":258,"date":"2026-02-12","account":"RCBC","category":"SecBank","subcategory":"","type":"transfer_out","amount":5279.0,"note":""},{"id":259,"date":"2026-02-12","account":"Maya","category":"RCBC","subcategory":"","type":"transfer_in","amount":1780.86,"note":""},{"id":260,"date":"2026-02-12","account":"RCBC","category":"Maya","subcategory":"","type":"transfer_out","amount":1780.86,"note":""},{"id":261,"date":"2026-02-12","account":"UnionB","category":"RCBC","subcategory":"","type":"transfer_in","amount":1916.06,"note":""},{"id":262,"date":"2026-02-12","account":"RCBC","category":"UnionB","subcategory":"","type":"transfer_out","amount":1916.06,"note":""},{"id":263,"date":"2026-02-12","account":"UnionB","category":"Cash","subcategory":"","type":"transfer_in","amount":240.0,"note":""},{"id":264,"date":"2026-02-12","account":"Cash","category":"UnionB","subcategory":"","type":"transfer_out","amount":240.0,"note":""},{"id":265,"date":"2026-02-12","account":"RCBC","category":"Bills","subcategory":"Parents","type":"expense","amount":165.0,"note":""},{"id":266,"date":"2026-02-11","account":"UnionB","category":"🍜 Food","subcategory":"Beverages","type":"expense","amount":126.0,"note":""},{"id":267,"date":"2026-02-11","account":"UnionB","category":"🚖 Transport","subcategory":"Bike","type":"expense","amount":215.0,"note":""},{"id":268,"date":"2026-02-11","account":"Cash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":190.0,"note":""},{"id":269,"date":"2026-02-11","account":"Maya","category":"Personal","subcategory":"Load","type":"expense","amount":99.0,"note":""},{"id":270,"date":"2026-02-11","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":1000.0,"note":""},{"id":271,"date":"2026-02-11","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":1800.0,"note":""},{"id":272,"date":"2026-02-10","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":645.5,"note":""},{"id":273,"date":"2026-02-10","account":"RCBC","category":"More Staffing","subcategory":"Salary","type":"income","amount":18569.08,"note":""},{"id":274,"date":"2026-02-10","account":"RCBC","category":"Bills","subcategory":"Parents","type":"expense","amount":3010.0,"note":""},{"id":275,"date":"2026-02-10","account":"UnionB","category":"Pauliney❤️","subcategory":"","type":"expense","amount":190.0,"note":""},{"id":276,"date":"2026-02-09","account":"UnionB","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":95.0,"note":""},{"id":277,"date":"2026-02-09","account":"UnionB","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":235.0,"note":""},{"id":278,"date":"2026-02-08","account":"UnionB","category":"🍜 Food","subcategory":"Beverages","type":"expense","amount":130.0,"note":""},{"id":279,"date":"2026-02-08","account":"Maya","category":"🍜 Food","subcategory":"Restaurants ","type":"expense","amount":225.62,"note":""},{"id":280,"date":"2026-02-08","account":"Maya","category":"Bills","subcategory":"Kocco","type":"expense","amount":451.25,"note":""},{"id":281,"date":"2026-02-08","account":"Maya","category":"🚖 Transport","subcategory":"Car","type":"expense","amount":225.62,"note":""},{"id":282,"date":"2026-02-08","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":116.5,"note":""},{"id":283,"date":"2026-02-07","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":1220.5,"note":""},{"id":284,"date":"2026-02-07","account":"Cash","category":"🎁 Gift","subcategory":"","type":"expense","amount":425.0,"note":""},{"id":285,"date":"2026-02-07","account":"Cash","category":"Personal","subcategory":"Haircut","type":"expense","amount":230.0,"note":""},{"id":286,"date":"2026-02-07","account":"Cash","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":100.0,"note":""},{"id":287,"date":"2026-02-07","account":"UnionB","category":"Bills","subcategory":"Parents","type":"expense","amount":284.5,"note":""},{"id":288,"date":"2026-02-06","account":"Cash","category":"🍜 Food","subcategory":"Coffee","type":"expense","amount":140.0,"note":""},{"id":289,"date":"2026-02-05","account":"UnionB","category":"🎁 Gift","subcategory":"","type":"expense","amount":279.0,"note":""},{"id":290,"date":"2026-02-05","account":"UnionB","category":"Date❤️","subcategory":"","type":"expense","amount":715.0,"note":""},{"id":291,"date":"2026-02-04","account":"BankCom","category":"Modified Bal.","subcategory":"","type":"balance","amount":1000.0,"note":"Difference"},{"id":292,"date":"2026-02-04","account":"EastWest","category":"Modified Bal.","subcategory":"","type":"balance","amount":500.0,"note":"Difference"},{"id":293,"date":"2026-02-04","account":"UnionB","category":"Personal","subcategory":"Toiletries","type":"expense","amount":303.0,"note":""},{"id":294,"date":"2026-02-04","account":"Cash","category":"Helping🙏🏼","subcategory":"","type":"expense","amount":1000.0,"note":""},{"id":295,"date":"2026-02-04","account":"GCash","category":"🍜 Food","subcategory":"Fastfood","type":"expense","amount":230.0,"note":""},{"id":296,"date":"2026-02-04","account":"Cash","category":"🍜 Food","subcategory":"Beverages","type":"expense","amount":75.0,"note":""},{"id":297,"date":"2026-02-04","account":"Maya","category":"🧘🏼 Subscription","subcategory":"Load","type":"expense","amount":99.0,"note":""},{"id":298,"date":"2026-02-04","account":"Cash","category":"UnionB","subcategory":"","type":"transfer_in","amount":2900.0,"note":""},{"id":299,"date":"2026-02-04","account":"UnionB","category":"Cash","subcategory":"","type":"transfer_out","amount":2900.0,"note":""},{"id":300,"date":"2026-02-04","account":"UnionB","category":"Bills","subcategory":"","type":"expense","amount":5000.0,"note":""},{"id":301,"date":"2026-02-04","account":"UnionB","category":"Tithe","subcategory":"","type":"expense","amount":1867.66,"note":""},{"id":302,"date":"2026-02-03","account":"UnionB","category":"Gadget","subcategory":"Phone","type":"expense","amount":3710.0,"note":"Phone 2/24"},{"id":303,"date":"2026-02-03","account":"UnionB","category":"More Staffing","subcategory":"Salary","type":"income","amount":18676.6,"note":""},{"id":304,"date":"2026-02-02","account":"SecBank","category":"Modified Bal.","subcategory":"","type":"balance","amount":5395.42,"note":"Difference"},{"id":305,"date":"2026-02-02","account":"SecBank","category":"Gadget","subcategory":"Laptop","type":"expense","amount":2745.42,"note":"Laptop 6/24"},{"id":306,"date":"2026-02-02","account":"SecBank","category":"🧘🏼 Subscription","subcategory":"Gym","type":"expense","amount":2650.0,"note":""},{"id":307,"date":"2026-02-02","account":"SecBank","category":"Modified Bal.","subcategory":"","type":"balance","amount":3179.15,"note":"Difference"},{"id":308,"date":"2026-02-02","account":"RCBC","category":"Modified Bal.","subcategory":"","type":"balance","amount":36054.09,"note":"Difference"},{"id":309,"date":"2026-02-01","account":"GCash","category":"Modified Bal.","subcategory":"","type":"balance","amount":1858.42,"note":"Difference"},{"id":310,"date":"2026-02-01","account":"Maya","category":"Modified Bal.","subcategory":"","type":"balance","amount":54131.12,"note":"Difference"},{"id":311,"date":"2026-02-01","account":"Cash","category":"Modified Bal.","subcategory":"","type":"balance","amount":1900.0,"note":"Difference"}];

const ACCOUNTS_META = [
  { name:"Cash",     type:"cash",    color:"#10B981", icon:"💵" },
  { name:"UnionB",   type:"bank",    color:"#1E40AF", icon:"🏦", fullName:"UnionBank" },
  { name:"BDO",      type:"bank",    color:"#0369A1", icon:"🏦", fullName:"BDO" },
  { name:"RCBC",     type:"bank",    color:"#DC2626", icon:"🏦", fullName:"RCBC" },
  { name:"Maya",     type:"ewallet", color:"#7C3AED", icon:"📱", fullName:"Maya" },
  { name:"GCash",    type:"ewallet", color:"#1D4ED8", icon:"📱", fullName:"GCash" },
  { name:"MariBank", type:"bank",    color:"#0891B2", icon:"🏦", fullName:"MariBank" },
  { name:"SecBank",  type:"bank",    color:"#7F1D1D", icon:"🏦", fullName:"Security Bank" },
  { name:"BankCom",  type:"bank",    color:"#D97706", icon:"🏦", fullName:"BankCom" },
  { name:"EastWest", type:"bank",    color:"#B45309", icon:"🏦", fullName:"EastWest Bank" },
];

const CAT_META = {
  "🍜 Food":           { icon:"🍜", color:"#EF4444" },
  "🚖 Transport":      { icon:"🚖", color:"#F59E0B" },
  "Date❤️":           { icon:"❤️",  color:"#EC4899" },
  "Bills":             { icon:"📄", color:"#DC2626" },
  "Helping🙏🏼":        { icon:"🙏🏼", color:"#10B981" },
  "Pauliney❤️":        { icon:"💑", color:"#F43F5E" },
  "🎁 Gift":           { icon:"🎁", color:"#8B5CF6" },
  "🧥 Apparel":        { icon:"🧥", color:"#6366F1" },
  "🧘🏼 Subscription":  { icon:"📲", color:"#14B8A6" },
  "Gadget":            { icon:"📱", color:"#3B82F6" },
  "Tithe":             { icon:"⛪", color:"#22C55E" },
  "Personal":          { icon:"🪞", color:"#A855F7" },
  "📙 Work Stuff":     { icon:"📙", color:"#F97316" },
  "Bank":              { icon:"🏛️", color:"#64748B" },
  "Reset":             { icon:"🔄", color:"#94A3B8" },
  "More Staffing":     { icon:"💰", color:"#16A34A" },
  "Modified Bal.":     { icon:"⚙️", color:"#94A3B8" },
};

const EXPENSE_CATEGORIES = [
  "🍜 Food","🚖 Transport","Date❤️","Bills","Helping🙏🏼","Pauliney❤️",
  "🎁 Gift","🧥 Apparel","🧘🏼 Subscription","Gadget","Tithe","Personal",
  "📙 Work Stuff","Bank","Reset",
];

const initBudgets = EXPENSE_CATEGORIES.map((c,i) => ({
  id: i+1, categoryName: c, amount: 0
}));

// ── HELPERS ─────────────────────────────────────────────────────────────────
function getToday() {
  return new Date().toISOString().slice(0,10);
}

function getDateRange(filter) {
  const today = getToday();
  const now = new Date(today);
  switch (filter.type) {
    case "week": {
      const s = new Date(now); s.setDate(s.getDate()-6);
      return { start: s.toISOString().slice(0,10), end: today };
    }
    case "month": {
      return { start: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-01`, end: today };
    }
    case "quarter": {
      const q = Math.floor(now.getMonth()/3);
      const sm = q*3+1;
      return { start: `${now.getFullYear()}-${String(sm).padStart(2,"0")}-01`, end: today };
    }
    case "year": {
      return { start: `${now.getFullYear()}-01-01`, end: today };
    }
    case "custom": {
      return { start: filter.start || today, end: filter.end || today };
    }
    default: return { start: today, end: today };
  }
}

function filterTx(txs, filter) {
  const { start, end } = getDateRange(filter);
  return txs.filter(t => t.date >= start && t.date <= end);
}

function computeBalance(accountName, txs) {
  return txs.reduce((sum, t) => {
    if (t.account !== accountName) return sum;
    if (["income","balance","transfer_in"].includes(t.type)) return sum + t.amount;
    if (["expense","transfer_out"].includes(t.type)) return sum - t.amount;
    return sum;
  }, 0);
}

function groupByDate(txs) {
  const groups = {};
  [...txs].sort((a,b) => b.date.localeCompare(a.date) || b.id - a.id).forEach(t => {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  });
  return groups;
}

function getCatIcon(cat) {
  return CAT_META[cat]?.icon || "💸";
}
function getCatColor(cat, idx=0) {
  return CAT_META[cat]?.color || PALETTE[idx % PALETTE.length];
}

function getTxLabel(t) {
  if (t.type === "transfer_in")  return `Transfer from ${t.category}`;
  if (t.type === "transfer_out") return `Transfer to ${t.category}`;
  if (t.type === "balance")      return "Balance Adjustment";
  const sub = t.subcategory ? ` · ${t.subcategory}` : "";
  return `${t.category}${sub}`;
}

function getTxIcon(t) {
  if (t.type === "transfer_in" || t.type === "transfer_out") return "↔️";
  if (t.type === "balance") return "⚙️";
  return getCatIcon(t.category);
}

function getTxAmountColor(t) {
  if (t.type === "income" || t.type === "balance") return "text-emerald-600";
  if (t.type === "transfer_in") return "text-blue-600";
  if (t.type === "transfer_out") return "text-orange-500";
  return "text-red-500";
}

function getTxAmountPrefix(t) {
  if (t.type === "income" || t.type === "balance") return "+";
  if (t.type === "transfer_in") return "+";
  if (t.type === "transfer_out") return "-";
  return "-";
}

function generateAnalysis(txs, budgets, filter) {
  const filtered = filterTx(txs, filter);
  const income = filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expenses = filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const net = income - expenses;
  const savingsRate = income > 0 ? (net/income*100) : 0;
  const tithe = filtered.filter(t=>t.category==="Tithe").reduce((s,t)=>s+t.amount,0);
  const titheRate = income > 0 ? (tithe/income*100) : 0;

  const catSpend = {};
  filtered.filter(t=>t.type==="expense").forEach(t=>{
    catSpend[t.category] = (catSpend[t.category]||0) + t.amount;
  });
  const topCats = Object.entries(catSpend).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const budgetIssues = budgets.filter(b=>b.amount>0&&(catSpend[b.categoryName]||0)>b.amount)
    .map(b=>({name:b.categoryName,budget:b.amount,spent:catSpend[b.categoryName]||0}));
  const dateSpend = (catSpend["Date❤️"]||0)+(catSpend["Pauliney❤️"]||0);
  const giftSpend = catSpend["🎁 Gift"]||0;

  const sections = [];

  // 1. Tithe check (Pentecostal)
  if (titheRate >= 9.5) {
    sections.push(`🙏 FIRST FRUITS HONORED\nYou gave ${fmt(tithe)} (${titheRate.toFixed(1)}% of income) as your tithe. Malachi 3:10 — \"Test me in this,\" says the LORD. You\'re passing the test. The windows of Heaven are open over your finances. Don\'t stop — this is non-negotiable covenant ground.`);
  } else if (tithe > 0) {
    sections.push(`🙏 TITHE — ALMOST, NOT QUITE\nYou gave ${fmt(tithe)} (${titheRate.toFixed(1)}%) — short of the 10% God calls you to. Malachi 3:10 is not a suggestion. It\'s a dare from a generous God. Bring the FULL tithe — first fruits, not leftovers. Trust Him with the math. You cannot out-give God.`);
  } else {
    sections.push(`🚨 ZERO TITHE THIS PERIOD\nThis is the most important line in this report. ₱0 given. Malachi 3:10: \"Test me in this,\" says the LORD. You cannot activate a blessing on a covenant you haven\'t honored. Fix this before reading another line. First fruits, not last thoughts.`);
  }

  // 2. Financial snapshot (Hormozi)
  const snap = savingsRate >= 20 ? "Solid. You\'re stacking. Keep compounding — don\'t lifestyle-inflate." :
    savingsRate >= 10 ? "Survival mode. Functional, but not building wealth. You need to flip this." :
    savingsRate > 0 ? "Under 10% savings. You\'re running on fumes. Every peso above basic needs should be captured, not spent." :
    "NET NEGATIVE. You spent more than you earned. This is the definition of going backward. Emergency changes needed now.";
  sections.push(`💰 THE NUMBERS DON\'T LIE\nIncome: ${fmt(income)}\nExpenses: ${fmt(expenses)}\nNet: ${fmt(net)}\nSavings Rate: ${savingsRate.toFixed(1)}%\n\n${snap}`);

  // 3. Top spending
  if (topCats.length > 0) {
    const lines = topCats.map((c,i)=>`${i+1}. ${c[0]}: ${fmt(c[1])}${income>0?` (${(c[1]/income*100).toFixed(1)}% of income)`:""}`).join("\n");
    sections.push(`📊 WHERE YOUR MONEY WENT (Top ${topCats.length})\n${lines}\n\nHormozi principle: \"Every peso you spend is a vote for the life you\'re building.\" Are these the votes you want to cast?`);
  }

  // 4. Relationship & generosity
  if (dateSpend > 0 || giftSpend > 0) {
    const rel = dateSpend + giftSpend;
    const pct = income > 0 ? (rel/income*100).toFixed(1) : "0";
    sections.push(`❤️ RELATIONSHIP & GENEROSITY\nDates + Pauliney + Gifts: ${fmt(rel)} (${pct}% of income)\n\nLove is not measured in pesos — but it IS funded by them. Proverbs 24:27: \"Prepare your work outside... then build your house.\" Build your financial foundation first so love is never constrained by money. A man who masters money can love without counting the cost.`);
  }

  // 5. Budget breaches
  if (budgetIssues.length > 0) {
    const lines = budgetIssues.map(b=>`• ${b.name}: Budget ${fmt(b.budget)} → Spent ${fmt(b.spent)} (+${fmt(b.spent-b.budget)} over)`).join("\n");
    sections.push(`⚠️ BUDGET BREACHES — OWN IT\n${lines}\n\nHormozi: \"You don\'t have a money problem, you have a decision problem.\" Every breach above was a decision. Own it, then build a system so it doesn\'t happen again.`);
  } else if (budgets.some(b=>b.amount>0)) {
    sections.push(`✅ BUDGET DISCIPLINE\nAll tracked categories are within budget. This is how wealth is built — not through big wins, but through consistent discipline. Proverbs 21:5: \"The plans of the diligent lead to profit.\"`)
  } else {
    sections.push(`📋 SET YOUR BUDGETS\nNo budgets set yet. Go to the Budget tab and assign amounts to each category. You cannot manage what you don\'t measure. This single step will change your financial trajectory.`);
  }

  // 6. Action steps
  const topCat = topCats[0];
  sections.push(`🎯 YOUR NEXT 4 MOVES (this week)\n1. Set a peso budget in every category in the Budget tab. What gets measured, gets managed.\n2. ${topCat?`Your #1 spend is ${topCat[0]} at ${fmt(topCat[1])}. Is there a 10-20% cut without compromising life quality?`:"Identify your top spending category and evaluate it."}`+"\n3. Automate your tithe — first transaction the moment salary hits. Pre-committed, non-negotiable, Kingdom first.\n4. Build a 1-month expense buffer. Financial freedom begins with not being 30 days from broke.");

  // 7. Kingdom close
  sections.push(`🔥 KINGDOM FINANCE — FINAL WORD\nDeuteronomy 8:18: \"He gives you the ability to produce wealth.\" You have been given income, a company, skills, and time. The question is stewardship.\n\nBuild with intention. Give generously. Save aggressively. Spend deliberately. You\'re not just managing money — you\'re managing the resources of a Kingdom citizen.\n\nGod\'s favor is real. Now match it with systems.`);

  return sections.join("\n\n---\n\n");
}

// ── CUSTOM PIE TOOLTIP ───────────────────────────────────────────────────────
function PieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  const pct = d.payload && d.payload.percent != null ? (d.payload.percent*100).toFixed(1) : "0";
  return (
    <div className="bg-white shadow-xl rounded-xl p-3 text-sm border border-gray-100">
      <p className="font-bold text-gray-800">{d.name}</p>
      <p className="text-gray-500">{fmt(d.value)}</p>
      <p className="text-indigo-600 font-bold text-base">{pct}%</p>
    </div>
  );
}

// ── DATE FILTER BAR ──────────────────────────────────────────────────────────
function DateFilterBar({ filter, setFilter }) {
  const tabs = ["week","month","quarter","year","custom"];
  return (
    <div className="space-y-2">
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(f => ({...f, type:t}))}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter.type===t ? "bg-white text-indigo-600 shadow" : "text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>
      {filter.type==="custom" && (
        <div className="flex gap-2">
          <input type="date" value={filter.start||""} onChange={e=>setFilter(f=>({...f,start:e.target.value}))}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          <span className="self-center text-gray-400 text-sm">to</span>
          <input type="date" value={filter.end||""} onChange={e=>setFilter(f=>({...f,end:e.target.value}))}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      )}
    </div>
  );
}

// ── SUMMARY CARDS ─────────────────────────────────────────────────────────────
function SummaryCards({ income, expenses, net }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-emerald-50 rounded-2xl p-3 text-center">
        <p className="text-xs text-emerald-600 font-semibold mb-1">Income</p>
        <p className="text-sm font-bold text-emerald-700 leading-tight">{fmt(income)}</p>
      </div>
      <div className="bg-red-50 rounded-2xl p-3 text-center">
        <p className="text-xs text-red-500 font-semibold mb-1">Expenses</p>
        <p className="text-sm font-bold text-red-600 leading-tight">{fmt(expenses)}</p>
      </div>
      <div className={`${net>=0?"bg-blue-50":"bg-orange-50"} rounded-2xl p-3 text-center`}>
        <p className={`text-xs font-semibold mb-1 ${net>=0?"text-blue-600":"text-orange-500"}`}>Net</p>
        <p className={`text-sm font-bold leading-tight ${net>=0?"text-blue-700":"text-orange-600"}`}>{fmt(net)}</p>
      </div>
    </div>
  );
}

// ── TRANSACTION CARD ─────────────────────────────────────────────────────────
function TxCard({ t, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-3 px-1 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${getCatColor(t.category)}20` }}>
        {getTxIcon(t)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{getTxLabel(t)}</p>
        <p className="text-xs text-gray-400 truncate">{t.account}{t.note ? ` · ${t.note}` : ""}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${getTxAmountColor(t)}`}>
          {getTxAmountPrefix(t)}{fmt(t.amount)}
        </p>
      </div>
      {(onEdit||onDelete) && (
        <div className="flex gap-1 flex-shrink-0">
          {onEdit && <button onClick={()=>onEdit(t)} className="p-1 text-gray-300 hover:text-indigo-400 transition-colors"><Edit2 size={13}/></button>}
          {onDelete && <button onClick={()=>onDelete(t.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={13}/></button>}
        </div>
      )}
    </div>
  );
}

// ── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── TX FORM MODAL ─────────────────────────────────────────────────────────────
function TxFormModal({ tx, accounts, onSave, onClose }) {
  const [form, setForm] = useState(tx || {
    date: getToday(), account:"", category:"", subcategory:"",
    type:"expense", amount:"", note:""
  });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const allCats = [...EXPENSE_CATEGORIES, "More Staffing"];
  return (
    <Modal title={tx ? "Edit Transaction" : "Add Transaction"} onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
            <input type="date" value={form.date} onChange={set("date")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
            <select value={form.type} onChange={set("type")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer_in">Transfer In</option>
              <option value="transfer_out">Transfer Out</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Account</label>
          <select value={form.account} onChange={set("account")}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">Select account</option>
            {ACCOUNTS_META.map(a=><option key={a.name} value={a.name}>{a.icon} {a.fullName||a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
          <select value={form.category} onChange={set("category")}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">Select category</option>
            {allCats.map(c=><option key={c} value={c}>{getCatIcon(c)} {c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Subcategory (optional)</label>
          <input value={form.subcategory} onChange={set("subcategory")} placeholder="e.g. Coffee, Parents…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Amount (₱)</label>
          <input type="number" min="0" step="0.01" value={form.amount} onChange={set("amount")} placeholder="0.00"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Note (optional)</label>
          <input value={form.note} onChange={set("note")} placeholder="Optional note…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
        </div>
        <button onClick={()=>{ if(!form.account||!form.category||!form.amount) return; onSave({...form,amount:parseFloat(form.amount)||0}); }}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-colors mt-2">
          {tx ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </Modal>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ transactions }) {
  const [filter, setFilter] = useState({ type:"month" });
  const filtered = useMemo(()=>filterTx(transactions, filter), [transactions, filter]);
  const income  = useMemo(()=>filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),[filtered]);
  const expenses = useMemo(()=>filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),[filtered]);
  const net = income - expenses;

  const totalBalance = useMemo(()=>
    ACCOUNTS_META.reduce((s,a)=>s+computeBalance(a.name,transactions),0)
  ,[transactions]);

  const catSpend = useMemo(()=>{
    const m={};
    filtered.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});
    return Object.entries(m).sort((a,b)=>b[1]-a[1])
      .map((e,i)=>({name:e[0],value:e[1],color:getCatColor(e[0],i),percent:expenses>0?e[1]/expenses:0}));
  },[filtered, expenses]);

  const recent = useMemo(()=>[...transactions].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,5),[transactions]);

  return (
    <div className="space-y-5">
      <DateFilterBar filter={filter} setFilter={setFilter}/>
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-5 text-white">
        <p className="text-indigo-200 text-sm font-medium">Total Balance</p>
        <p className="text-4xl font-black mt-1">{fmt(totalBalance)}</p>
        <p className="text-indigo-200 text-xs mt-1">Across all accounts</p>
      </div>
      <SummaryCards income={income} expenses={expenses} net={net}/>

      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-1">Accounts</h3>
        <p className="text-xs text-gray-400 mb-4">Current balance per account</p>
        <div className="space-y-3">
          {ACCOUNTS_META.map(a=>{
            const bal = computeBalance(a.name, transactions);
            return (
              <div key={a.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{background:`${a.color}20`}}>
                  {a.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{a.fullName||a.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{a.type==="ewallet"?"E-Wallet":a.type==="cash"?"Cash":"Bank"}</p>
                </div>
                <p className={`text-sm font-bold ${bal<0?"text-red-500":"text-gray-800"}`}>{fmt(bal)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {catSpend.length>0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Where Your Money Goes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={catSpend} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false}>
                {catSpend.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip content={<PieTooltip/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {catSpend.slice(0,5).map((c,i)=>(
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:c.color}}/>
                <span className="text-xs text-gray-600 flex-1 truncate">{c.name}</span>
                <span className="text-xs font-bold text-gray-800">{(c.percent*100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>
        {recent.map(t=><TxCard key={t.id} t={t}/>)}
      </div>
    </div>
  );
}

// ── TRANSACTIONS VIEW ─────────────────────────────────────────────────────────
function TransactionsView({ transactions, onAdd, onEdit, onDelete }) {
  const [filter, setFilter] = useState({ type:"month" });
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const filtered = useMemo(()=>filterTx(transactions, filter), [transactions, filter]);
  const income  = useMemo(()=>filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),[filtered]);
  const expenses = useMemo(()=>filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),[filtered]);
  const net = income - expenses;
  const grouped = useMemo(()=>groupByDate(filtered),[filtered]);

  const toggleDay = (d) => setExpandedDays(prev=>{const n=new Set(prev);n.has(d)?n.delete(d):n.add(d);return n;});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-gray-900">Transactions</h2>
        <button onClick={()=>setShowForm(true)}
          className="flex items-center gap-1 bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-indigo-700">
          <Plus size={15}/> Add
        </button>
      </div>
      <DateFilterBar filter={filter} setFilter={setFilter}/>
      <SummaryCards income={income} expenses={expenses} net={net}/>

      {Object.keys(grouped).length===0 && (
        <div className="bg-white rounded-3xl p-8 text-center text-gray-400">
          <p className="text-4xl mb-2">📭</p>
          <p className="font-semibold">No transactions in this period</p>
        </div>
      )}

      {Object.entries(grouped).map(([date, txs])=>(
        <div key={date} className="bg-white rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{fmtDate(date)}</p>
            <p className="text-xs text-gray-400">{txs.length} entries</p>
          </div>
          {(expandedDays.has(date) ? txs : txs.slice(0,3)).map(t=>(
            <TxCard key={t.id} t={t}
              onEdit={tx=>{setEditTx(tx);setShowForm(true);}}
              onDelete={onDelete}/>
          ))}
          {txs.length>3 && (
            <button onClick={()=>toggleDay(date)}
              className="w-full mt-2 py-2 text-xs font-semibold text-indigo-500 hover:text-indigo-700 flex items-center justify-center gap-1">
              {expandedDays.has(date)
                ? <><ChevronUp size={13}/> Show less</>
                : <><ChevronDown size={13}/> +{txs.length-3} more</>}
            </button>
          )}
        </div>
      ))}

      {(showForm) && (
        <TxFormModal
          tx={editTx}
          accounts={ACCOUNTS_META}
          onSave={data=>{
            if(editTx){onEdit({...editTx,...data});}
            else{onAdd({...data,id:newId()});}
            setShowForm(false);setEditTx(null);
          }}
          onClose={()=>{setShowForm(false);setEditTx(null);}}/>
      )}
    </div>
  );
}

// ── ACCOUNTS VIEW ─────────────────────────────────────────────────────────────
function AccountsView({ transactions }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-gray-900">Accounts</h2>
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-5 text-white">
        <p className="text-indigo-200 text-sm font-medium">Total Balance</p>
        <p className="text-4xl font-black mt-1">
          {fmt(ACCOUNTS_META.reduce((s,a)=>s+computeBalance(a.name,transactions),0))}
        </p>
      </div>
      <div className="space-y-3">
        {ACCOUNTS_META.map(a=>{
          const bal = computeBalance(a.name, transactions);
          return (
            <div key={a.name} className="bg-white rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{background:`${a.color}20`}}>
                  {a.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{a.fullName||a.name}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {a.type==="ewallet"?"E-Wallet":a.type==="cash"?"Cash":"Bank Account"}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black ${bal<0?"text-red-500":"text-gray-900"}`}>{fmt(bal)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── BUDGET VIEW ───────────────────────────────────────────────────────────────
function BudgetView({ transactions, budgets, onUpdateBudget }) {
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const now = new Date();
  const monthFilter = { type:"month" };
  const filtered = useMemo(()=>filterTx(transactions,monthFilter),[transactions]);
  const catSpend = useMemo(()=>{
    const m={};
    filtered.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});
    return m;
  },[filtered]);

  const totalBudget = budgets.reduce((s,b)=>s+b.amount,0);
  const totalSpent = budgets.reduce((s,b)=>s+(catSpend[b.categoryName]||0),0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-gray-900">Monthly Budget</h2>
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700">Total Budget</span>
          <span className="font-bold text-gray-900">{fmt(totalBudget)}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Spent this month</span>
          <span className={`font-bold ${totalSpent>totalBudget&&totalBudget>0?"text-red-500":"text-gray-700"}`}>{fmt(totalSpent)}</span>
        </div>
        {totalBudget > 0 && (
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all ${(totalSpent/totalBudget)>1?"bg-red-500":"bg-indigo-500"}`}
              style={{width:`${Math.min((totalSpent/totalBudget)*100,100)}%`}}/>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">Tap a category to set budget amount</p>
      </div>

      <div className="space-y-3">
        {budgets.map(b=>{
          const spent = catSpend[b.categoryName]||0;
          const pct = b.amount>0 ? Math.min(spent/b.amount,1) : 0;
          const over = b.amount>0 && spent>b.amount;
          return (
            <div key={b.id} className="bg-white rounded-3xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{background:`${getCatColor(b.categoryName)}20`}}>
                  {getCatIcon(b.categoryName)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{b.categoryName}</p>
                  <p className={`text-xs ${over?"text-red-500":"text-gray-400"}`}>
                    {fmt(spent)} {b.amount>0?`/ ${fmt(b.amount)}`:"(no budget set)"}
                  </p>
                </div>
                {editId===b.id ? (
                  <div className="flex items-center gap-1">
                    <input type="number" value={editVal} onChange={e=>setEditVal(e.target.value)}
                      className="w-24 border border-indigo-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      autoFocus onKeyDown={e=>{ if(e.key==="Enter"){onUpdateBudget(b.id,parseFloat(editVal)||0);setEditId(null);}}}/>
                    <button onClick={()=>{onUpdateBudget(b.id,parseFloat(editVal)||0);setEditId(null);}}
                      className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-lg font-bold">✓</button>
                  </div>
                ) : (
                  <button onClick={()=>{setEditId(b.id);setEditVal(String(b.amount));}}
                    className="text-xs text-indigo-500 font-semibold border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-50">
                    {b.amount>0?"Edit":"Set"}
                  </button>
                )}
              </div>
              {b.amount>0 && (
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${over?"bg-red-500":"bg-indigo-500"}`}
                    style={{width:`${pct*100}%`}}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── STATISTICS VIEW ───────────────────────────────────────────────────────────
function StatisticsView({ transactions, budgets }) {
  const [filter, setFilter] = useState({ type:"month" });
  const [showAI, setShowAI] = useState(false);
  const [aiText, setAIText] = useState("");

  const filtered = useMemo(()=>filterTx(transactions,filter),[transactions,filter]);
  const income  = useMemo(()=>filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),[filtered]);
  const expenses = useMemo(()=>filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),[filtered]);
  const net = income - expenses;

  const catSpend = useMemo(()=>{
    const m={};
    filtered.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});
    return Object.entries(m).sort((a,b)=>b[1]-a[1])
      .map((e,i)=>({name:e[0],value:e[1],color:getCatColor(e[0],i),percent:expenses>0?e[1]/expenses:0}));
  },[filtered,expenses]);

  // Monthly bar data — last 4 months
  const barData = useMemo(()=>{
    const months = [];
    const now = new Date();
    for(let i=3;i>=0;i--){
      const d=new Date(now.getFullYear(),now.getMonth()-i,1);
      const mStr=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      const mLabel=d.toLocaleDateString("en",{month:"short"});
      const mTxs=transactions.filter(t=>t.date.startsWith(mStr));
      months.push({
        month:mLabel,
        Income:mTxs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),
        Expenses:mTxs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),
      });
    }
    return months;
  },[transactions]);

  const runAI = () => {
    const txt = generateAnalysis(transactions, budgets, filter);
    setAIText(txt);
    setShowAI(true);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-black text-gray-900">Statistics</h2>
      <DateFilterBar filter={filter} setFilter={setFilter}/>
      <SummaryCards income={income} expenses={expenses} net={net}/>

      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Monthly Overview</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barGap={4}>
            <XAxis dataKey="month" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} width={35}/>
            <Tooltip formatter={(v)=>[fmt(v)]}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11}}/>
            <Bar dataKey="Income" fill="#10B981" radius={[4,4,0,0]}/>
            <Bar dataKey="Expenses" fill="#EF4444" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {catSpend.length>0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={catSpend} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false}>
                {catSpend.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip content={<PieTooltip/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2.5">
            {catSpend.map((c,i)=>(
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:c.color}}/>
                <span className="text-xs text-gray-600 flex-1">{c.name}</span>
                <span className="text-xs text-gray-500 w-20 text-right">{fmt(c.value)}</span>
                <span className="text-xs font-bold text-gray-800 w-10 text-right">{(c.percent*100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={runAI}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
        <Brain size={20}/>
        AI Budget Analysis
      </button>

      {showAI && (
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-indigo-600"/>
              <h3 className="font-bold text-gray-800">AI Analysis</h3>
            </div>
            <button onClick={()=>setShowAI(false)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
          </div>
          <div className="space-y-4">
            {aiText.split("\n\n---\n\n").map((section,i)=>(
              <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                {section.split("\n").map((line,j)=>(
                  <p key={j} className={`text-sm text-gray-700 leading-relaxed ${j===0?"font-bold text-gray-900 mb-1":""}`}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [transactions, setTransactions] = useState(INIT_TX);
  const [budgets, setBudgets] = useState(initBudgets);
  const [view, setView] = useState("dashboard");

  const addTx    = t => setTransactions(prev=>[t,...prev]);
  const editTx   = t => setTransactions(prev=>prev.map(x=>x.id===t.id?t:x));
  const deleteTx = id=> setTransactions(prev=>prev.filter(x=>x.id!==id));
  const updateBudget = (id,amount) => setBudgets(prev=>prev.map(b=>b.id===id?{...b,amount}:b));

  const NAV = [
    {id:"dashboard", icon:<Home size={20}/>,    label:"Home"},
    {id:"transactions",icon:<List size={20}/>,  label:"Transactions"},
    {id:"accounts",  icon:<Wallet size={20}/>,  label:"Accounts"},
    {id:"budget",    icon:<Tag size={20}/>,      label:"Budget"},
    {id:"statistics",icon:<BarChart2 size={20}/>,label:"Stats"},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto pb-24">
        <div className="px-4 pt-6">
          {view==="dashboard"   && <Dashboard transactions={transactions}/>}
          {view==="transactions" && <TransactionsView transactions={transactions} onAdd={addTx} onEdit={editTx} onDelete={deleteTx}/>}
          {view==="accounts"    && <AccountsView transactions={transactions}/>}
          {view==="budget"      && <BudgetView transactions={transactions} budgets={budgets} onUpdateBudget={updateBudget}/>}
          {view==="statistics"  && <StatisticsView transactions={transactions} budgets={budgets}/>}
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-40">
        <div className="max-w-lg mx-auto flex justify-around">
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setView(n.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                view===n.id ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}>
              {n.icon}
              <span className="text-[10px] font-semibold">{n.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
