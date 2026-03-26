import { useState, useMemo } from "react";
import { Flex, Table, Tag, Card, Select, Input } from "antd";
import { useAdopt } from "@/app/providers/adopt";
import { useCart } from "@/app/providers/cart";

export function Dashboard() {
  const { adoptItems } = useAdopt();
  const { cartItems } = useCart();
  const [adoptFilter, setAdoptFilter] = useState("");
  const [donateTypeFilter, setDonateTypeFilter] = useState(null);
  const [catNameFilter, setCatNameFilter] = useState("");

  const donationTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return (
        total + (item.food || 0) + (item.medical || 0) + (item.supplies || 0)
      );
    }, 0);
  }, [cartItems]);

  const adoptData = useMemo(() => {
    const result = [];
    adoptItems.forEach((item) => {
      result.push({
        key: `${item.id}-key`,
        catId: item.id,
        name: item.cat?.name || "Unknown",
        image: item.cat?.url || "",
        createdAt: item.createdAt,
        user: item.fullName,
        phone: item.phone || "-",
        lineId: item.lineId || "-",
      });
    });
    return result;
  }, [adoptItems]);

  const adoptColumns = [
    {
      title: "รูปภาพ",
      dataIndex: "image",
      key: "image",
      render: (src) => (
        <img
          src={src}
          alt="cat"
          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "ชื่อแมว",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "ผู้รับเลี้ยง",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Line ID",
      dataIndex: "lineId",
      key: "lineId",
    },
    {
      title: "วันที่รับเลี้ยง",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("th-TH") : "-",
    },
  ];

  const donationData = useMemo(() => {
    const result = [];
    cartItems.forEach((item) => {
      if (item.food > 0) {
        result.push({
          key: `${item.id}-food`,
          catId: item.id,
          catName: item.cat?.name || "Unknown",
          catImage: item.cat?.url || "",
          type: "อาหาร",
          amount: item.food,
          users: item.users,
        });
      }
      if (item.medical > 0) {
        result.push({
          key: `${item.id}-medical`,
          catId: item.id,
          catName: item.cat?.name || "Unknown",
          catImage: item.cat?.url || "",
          type: "การแพทย์",
          amount: item.medical,
          users: item.users,
        });
      }
      if (item.supplies > 0) {
        result.push({
          key: `${item.id}-supplies`,
          catId: item.id,
          catName: item.cat?.name || "Unknown",
          catImage: item.cat?.url || "",
          type: "อุปกรณ์",
          amount: item.supplies,
          users: item.users,
        });
      }
    });
    return result;
  }, [cartItems]);

  const filteredDonationData = useMemo(() => {
    return donationData.filter((item) => {
      if (donateTypeFilter && item.type !== donateTypeFilter) return false;
      if (
        catNameFilter &&
        !item.catName.toLowerCase().includes(catNameFilter.toLowerCase())
      )
        return false;
      return true;
    });
  }, [donationData, donateTypeFilter, catNameFilter]);

  const filteredAdoptData = useMemo(() => {
    if (!adoptFilter) return adoptData;
    return adoptData.filter(
      (item) =>
        item.name?.toLowerCase().includes(adoptFilter.toLowerCase()) ||
        item.user?.toLowerCase().includes(adoptFilter.toLowerCase()),
    );
  }, [adoptData, adoptFilter]);

  const donationColumns = [
    {
      title: "รูปภาพ",
      dataIndex: "catImage",
      key: "catImage",
      render: (src) =>
        src ? (
          <img
            src={src}
            alt="cat"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "ชื่อแมว",
      dataIndex: "catName",
      key: "catName",
    },
    {
      title: "ประเภทบริจาค",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const colorMap = {
          อาหาร: "green",
          การแพทย์: "blue",
          อุปกรณ์: "purple",
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: "จำนวนเงิน",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `฿${amount}`,
    },
    {
      title: "ผู้บริจาค",
      dataIndex: "users",
      key: "users",
      render: (users) => (
        <Flex gap="small" align="center" wrap>
          {users?.map((user, idx) => (
            <Tag key={idx}>{user}</Tag>
          ))}
        </Flex>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="container-dashboard">
      <h1>Dashboard Admin</h1>

      <Card style={{ marginBottom: 16 }}>
        <Flex gap="large" align="center">
          <div>
            <div style={{ fontSize: 14, color: "#888" }}>ยอดบริจาครวม</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: "#52c41a" }}>
              ฿{donationTotal}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: "#888" }}>จำนวนรายการบริจาค</div>
            <div style={{ fontSize: 32, fontWeight: "bold" }}>
              {donationData.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: "#888" }}>จำนวนการรับเลี้ยง</div>
            <div style={{ fontSize: 32, fontWeight: "bold" }}>
              {adoptItems.length}
            </div>
          </div>
        </Flex>
      </Card>

      <h1>การบริจาค</h1>
      <Flex gap="small" style={{ marginBottom: 16 }}>
        <Input
          placeholder="ค้นหาชื่อแมว"
          style={{ width: 200 }}
          value={catNameFilter}
          onChange={(e) => setCatNameFilter(e.target.value)}
          allowClear
        />
        <Select
          placeholder="ประเภทบริจาค"
          style={{ width: 150 }}
          value={donateTypeFilter}
          onChange={setDonateTypeFilter}
          allowClear
          options={[
            { value: "อาหาร", label: "อาหาร" },
            { value: "การแพทย์", label: "การแพทย์" },
            { value: "อุปกรณ์", label: "อุปกรณ์" },
          ]}
        />
      </Flex>
      <Table
        dataSource={filteredDonationData}
        columns={donationColumns}
        pagination={{ pageSize: 10 }}
      />

      <h1>การรับเลี้ยง</h1>
      <Flex gap="small" style={{ marginBottom: 16 }}>
        <Input
          placeholder="ค้นหาชื่อแมวหรือผู้รับเลี้ยง"
          style={{ width: 250 }}
          value={adoptFilter}
          onChange={(e) => setAdoptFilter(e.target.value)}
          allowClear
        />
      </Flex>
      <Table
        dataSource={filteredAdoptData}
        columns={adoptColumns}
        pagination={{ pageSize: 10 }}
      />
      </div>
    </div>
  );
}
