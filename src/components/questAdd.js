import "../App.css";
import {useState} from 'react';

export default function QuestBookApplication() {

  const [quests, setQuests] = useState((JSON.parse(window.localStorage.getItem('quests')) || []));

  const [errors, setError] = useState('');

  const [questCount, setCount] = useState((JSON.parse(window.localStorage.getItem('questCount')) || 0));

  const [complCount, setComplCount] = useState((JSON.parse(window.localStorage.getItem('complCount')) || 0));
  
  const [uncomplCount, setUncomplCount] = useState((JSON.parse(window.localStorage.getItem('uncomplCount')) || 0));

  const [subCount, setSubCount] = useState((JSON.parse(window.localStorage.getItem('subCount')) || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    let dscrp = document.getElementById("input-field")
    if (quests.length < 20 && dscrp.value !== "") { 
      setCount(questCount + 1)
      let newList = [
        ...quests,
        {
          description: dscrp.value,
          id: questCount,
          isCompleted: false,
          subQuests: []
        }
      ]
      setQuests(newList);
      window.localStorage.setItem('questCount', JSON.stringify(questCount + 1))
      window.localStorage.setItem('quests', JSON.stringify(newList))
      setUncomplCount(newList.filter(x => x.isCompleted===false).length);
      window.localStorage.setItem('uncomplCount', JSON.stringify(newList.filter(x => x.isCompleted===false).length))
      setError('');
      let popupId = document.getElementById('error-popup')
      popupId.style.display = "none";
      setTimeout(function() {
        popupId.classList.add("hidden");
        setTimeout(function() {
          popupId.style.display = "none";
        }, 1000);
      }, 5000);
    } else if (dscrp.value === "") {
      return undefined
    } else {
      let popupId = document.getElementById('error-popup')
      popupId.classList.remove("hidden");
      popupId.style.display = "block"
      setError("You have reached the quests limit.")
      setTimeout(function() {
        popupId.classList.add("hidden");
        setTimeout(function() {
          popupId.style.display = "none";
        }, 1000);
      }, 5000);
    }
    dscrp.value = ''
  }

  const handleToggleQuest = (questID, nextCondition) => {
    const fnc = quests.map(quest => {
      if (questID === quest.id) {
        return {...quest, isCompleted: nextCondition};
      } else {
        return quest
      }
    })
    setQuests(fnc);
    window.localStorage.setItem('quests', JSON.stringify(fnc))
    setComplCount(fnc.filter(x => x.isCompleted===true).length)
    window.localStorage.setItem('complCount', JSON.stringify(fnc.filter(x => x.isCompleted===true).length))
    setUncomplCount(fnc.filter(x => x.isCompleted===false).length)
    window.localStorage.setItem('uncomplCount', JSON.stringify(fnc.filter(x => x.isCompleted===false).length))
  }

  const completedCheck = (newList, quest) => {
    const completedLength = newList.filter(x => x.isCompleted===true).length
    const setList = quests.map(q => {
      if (q.id === quest) {
        if (q.subQuests.length === completedLength) {
          return {...q, isCompleted: true, subQuests: newList}
        } else {
          return {...q, isCompleted: false, subQuests: newList}
        }
      } else {
        return q
      }})
      setQuests(setList)
      window.localStorage.setItem('quests', JSON.stringify(setList))
      setComplCount(setList.filter(x => x.isCompleted===true).length)
      window.localStorage.setItem('complCount', JSON.stringify(setList.filter(x => x.isCompleted===true).length))
      setUncomplCount(setList.filter(x => x.isCompleted===false).length)
      window.localStorage.setItem('uncomplCount', JSON.stringify(setList.filter(x => x.isCompleted===false).length))
  }

  const handleToggleSubQuest = (quest, subquestID, nextCondition) => {
    const cacheValue = quest.subQuests.map(sq => {
      if (sq.id === subquestID) {
        return {...sq, isCompleted: nextCondition}
      } else {
        return sq
      }
    })
    let helpQuest = quest.id
    completedCheck(cacheValue, helpQuest)
  }

  const handleSubSubmit = (id, event) => {
    event.preventDefault()
    const fnc2 = quests.map(quest => {
      if (id === quest.id) {
        if (quest.subQuests.length < 5) {
          setSubCount(subCount + 1)
          let subDscrp = document.getElementById(`${id}subInput`)
          let oldList = quest.subQuests
          let newList1 = [
            ...oldList, {
              subQstDscr: subDscrp.value,
              id: `${id}sub${subCount}`,
              isCompleted: false
            }
          ]
          window.localStorage.setItem('subCount', JSON.stringify(subCount + 1))
          return {...quest, subQuests: newList1}
          } else if (quest.subQuests.length >= 5) {
            let popupId = document.getElementById('error-popup')
            popupId.style.display = "block"
            popupId.classList.remove("hidden");
            setError("You have reached the subquests limit.")
            setTimeout(function() {
              popupId.classList.add("hidden");
              setTimeout(function() {
                popupId.style.display = "none";
              }, 1000);
            }, 5000);
            return quest
          }
      } else {
        return quest
    }})
    setQuests(fnc2)
    window.localStorage.setItem('quests', JSON.stringify(fnc2))
  }

  return (
    <div style={{display: "flex", flexDirection:"column"}}>
      <ul className="header-main">
        <li className="header-left-element">
            <h1>QBook</h1>
        </li>
        <li className="header-right-element">
            <h2>Quests: {quests.length} <img alt="" src="https://i.imgur.com/RkdzEtx.png"/> {complCount} <img alt="" src="https://i.imgur.com/uHOoMfS.png"/> {uncomplCount}</h2>
        </li>
      </ul>
      <div className="main-content">
        <div className="popup" id="error-popup">
          <h2>{errors}</h2>
        </div>
        <form onSubmit = {handleSubmit} className="quest-form">
          <input type="text" id ="input-field" className="main-input-field" />
          <button className="main-input-button">+</button>
        </form>
        <ul className="quests-list">
          {quests.map(quest => (
            <div>
            <li id={`${quest.id}questarea`} key={quest.id} className="quest-class">
              <p className="quest-text">{quest.description}</p>
              <button className="quest-addsq" onClick = {e => {
                const subQuestFieldId = document.getElementById(`${quest.id}Form`)
                const questArea = document.getElementById(`${quest.id}questarea`)
                questArea.style.minHeight = "60px"
                subQuestFieldId.style.display = "inline-block"
              }}>
                +
              </button>
              <input id={`${quest.id}checkboz`} className="quest-checkform" type="checkbox" checked={quest.isCompleted} onChange = {e => {
                handleToggleQuest(quest.id, e.target.checked)
              }} />
              <button className="quest-delete" onClick = {() => {
                let delValue = quests.filter(q =>
                  q.id !== quest.id
                )
                setQuests(delValue)
                window.localStorage.setItem('quests', JSON.stringify(delValue))
                setComplCount(delValue.filter(x => x.isCompleted===true).length)
                window.localStorage.setItem('complCount', JSON.stringify(delValue.filter(x => x.isCompleted===true).length))
                setUncomplCount(delValue.filter(x => x.isCompleted===false).length)
                window.localStorage.setItem('uncomplCount', JSON.stringify(delValue.filter(x => x.isCompleted===false).length))
              }
              }>
              <img alt="" src="https://i.imgur.com/gj1H4mD.png" />
              </button>
              <div>
              <form className="sub-form" style = {{display: "none"}} id = {`${quest.id}Form`} onSubmit={e => {
              handleSubSubmit(quest.id, e)
              const questArea = document.getElementById(`${quest.id}questarea`)
                questArea.style.minHeight = "0px"
              const subQuestFieldId = document.getElementById(`${quest.id}Form`)
                subQuestFieldId.style.display = "none"
              const subQuestInputId = document.getElementById(`${quest.id}subInput`)
                subQuestInputId.value = ''
              }}>
                <input className="subinput-field" type="text" id = {`${quest.id}subInput`} />
                <button className="sub-input-button">
                Subquest
                </button>
              </form>
              <ul>
                {quest.subQuests.map(subquest => {
                  return (
                    <div>
                      <li className="subquest-class">
                    <p className="sub-text">{subquest.subQstDscr}
                    <input className="sub-checkbox" type="checkbox" checked={subquest.isCompleted} onChange = {e => {
                        handleToggleSubQuest(quest, subquest.id, e.target.checked)}} />
                      <button className="sub-delete" onClick = {() => {
                        let delValue = quest.subQuests.filter(q =>
                          q.id !== subquest.id
                        )
                        window.localStorage.setItem('quests', JSON.stringify(completedCheck(delValue, quest.id)))
                        completedCheck(delValue, quest.id)
                      }}>
                      <img className="del-img" alt="" src="https://i.imgur.com/gj1H4mD.png" />
                      </button>
                    </p>
                      </li>
                  </div>)
                })}
              </ul>
              </div>
            </li>
            </div>
          ))}
              <button className="clear-button" onClick={() => {
                setQuests([])
                window.localStorage.removeItem('quests')
                setCount(0)
                window.localStorage.removeItem('questCount')
                setUncomplCount(0)
                window.localStorage.removeItem('complCount')
                setComplCount(0)
                window.localStorage.removeItem('uncomplCount')
                setSubCount(0)
                window.localStorage.removeItem('subCount')
              }}>Clear All</button>
        </ul>
      </div>
    </div>
  )

}