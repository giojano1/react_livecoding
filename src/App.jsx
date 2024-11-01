import React, { useState } from "react";
import clockIcon from "/clock.svg";
const App = () => {
  const [inputCards, setInputCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleAddCard = () => {
    const newCard = {
      id: Date.now(),
      ip: "",
      country: "",
      timezone: "",
      status: "",
      countryCode: "",
    };
    setInputCards((prev) => [...prev, newCard]);
    console.log(inputCards);
  };
  const handleRemoveCard = (id) => {
    const filteredCards = inputCards.filter((card) => card.id !== id);
    setInputCards(filteredCards);
  };
  const handleClearCards = () => {
    setInputCards([]);
  };
  const handleToggleCards = async () => {
    const updatedCards = await Promise.all(
      inputCards.map(async (card) => {
        if (card) {
          try {
            setLoading(true);
            const res = await fetch(`http://ip-api.com/json/${card.ip}`);
            const data = await res.json();
            console.log(data);
            return {
              ...card,
              country: data.country,
              timezone: data.timezone,
              status: data.status,
              countryCode: data.countryCode,
            };
          } catch (error) {
            return {
              ...card,
              status: error,
            };
          } finally {
            setLoading(false);
          }
        }
        return card;
      })
    );
    setInputCards(updatedCards);
  };

  const handleInputChange = (id, value) => {
    setInputCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ip: value } : card))
    );
  };
  return (
    <main className="flex flex-col items-center justify-center py-10 ">
      <div className="w-[300px]">
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddCard}
            className="bg-[#E27125] text-white rounded-lg px-10 h-[37px] text-[14px] border border-transparent hover:border-white"
          >
            Add Item
          </button>
          <button
            onClick={handleClearCards}
            className="bg-[#19191B] text-white rounded-lg px-10 h-[37px] text-[14px] border border-transparent hover:border-white"
          >
            Clear
          </button>
        </div>
        <div className="mt-2  text-center">
          <button
            onClick={handleToggleCards}
            className="bg-[#19191B] w-full  text-white rounded-lg px-10 h-[37px] text-[14px] border border-transparent hover:border-white"
          >
            Toggle Cards
          </button>
        </div>
      </div>
      {/* content */}
      <section className="w-[300px] mt-10">
        {inputCards.length > 0 ? (
          <div className="flex flex-col gap-5">
            {inputCards.map((card) => (
              <div
                key={card.id}
                className=" w-full bg-[#151516] rounded-xl p-4 shadow h-28 text-[#FBD6C1]"
              >
                {card.status ? (
                  <div className="flex flex-col">
                    {card.status === "success" ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <img
                              src={`https://flagsapi.com/${card.countryCode}/flat/64.png`}
                              alt="flag"
                              className="h-6 w-6"
                            />
                            <h3>{card.country}</h3>
                          </div>

                          <button onClick={() => handleRemoveCard(card.id)}>
                            X
                          </button>
                        </div>
                        <h4 className="mt-4 flex items-center gap-2">
                          <img src={clockIcon} alt="clock" />
                          {card.timezone}
                        </h4>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h3>Nothing to show</h3>
                          <button onClick={() => handleRemoveCard(card.id)}>
                            X
                          </button>
                        </div>
                        <p className="opacity-50 text-[13px] mt-2">
                          Either no ip was provided or something went wrong
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex w-full justify-between items-center">
                      <span> {loading ? "loading" : "IP Address"}</span>
                      <button onClick={() => handleRemoveCard(card.id)}>
                        X
                      </button>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="8.8.8.8"
                        className="w-full rounded-lg mt-3 bg-black p-2 focus:outline-none"
                        onChange={(e) =>
                          handleInputChange(card.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-20 text-[#FBD6C1]">
            Use the button above to add items
          </p>
        )}
      </section>
    </main>
  );
};

export default App;
