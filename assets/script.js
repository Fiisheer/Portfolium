    const table = document.getElementById("tabela-armas");
    const headers = table.querySelectorAll("thead th");
    let sortState = {}; // guarda estado de ordenação por coluna

    // mapeamento de rank para valor numérico (S=melhor)
    const rankValue = { 'S': 6, 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1 };

    headers.forEach((header, index) => {
      header.addEventListener("click", () => {
        const type = header.getAttribute("data-type");
        const tbody = table.querySelector("tbody");
        const rows = Array.from(tbody.querySelectorAll("tr"));

        // alterna entre ascendente e descendente
        const currentState = sortState[index] === "asc" ? "desc" : "asc";
        sortState = {}; // reseta outros
        sortState[index] = currentState;

        // remove setas de outros
        headers.forEach(h => h.classList.remove("sort-asc","sort-desc"));
        header.classList.add(currentState === "asc" ? "sort-asc" : "sort-desc");

        rows.sort((ra, rb) => {
          const aCellEl = ra.children[index];
          const bCellEl = rb.children[index];

          let aVal, bVal;

          switch (type) {
            case "number":
              // extrai números (trata vírgula como decimal)
              const aTextN = aCellEl.innerText.trim().replace(",",".");
              const bTextN = bCellEl.innerText.trim().replace(",",".");
              aVal = parseFloat(aTextN) || 0;
              bVal = parseFloat(bTextN) || 0;
              break;

            case "stars":
              // procura a classe filled-X
              const aStars = aCellEl.querySelector(".stars")?.className.match(/filled-(\d)/)?.[1] || 0;
              const bStars = bCellEl.querySelector(".stars")?.className.match(/filled-(\d)/)?.[1] || 0;
              aVal = parseInt(aStars);
              bVal = parseInt(bStars);
              break;

            case "rank":
              // tenta pegar a letra dentro do .rank ou texto da célula
              const aRankEl = aCellEl.querySelector(".rank");
              const bRankEl = bCellEl.querySelector(".rank");
              const aRankTxt = (aRankEl ? aRankEl.textContent : aCellEl.innerText).trim().toUpperCase();
              const bRankTxt = (bRankEl ? bRankEl.textContent : bCellEl.innerText).trim().toUpperCase();
              aVal = rankValue[aRankTxt] || 0;
              bVal = rankValue[bRankTxt] || 0;
              break;

            default:
              // ordenação textual natural
              aVal = aCellEl.innerText.trim().toLowerCase();
              bVal = bCellEl.innerText.trim().toLowerCase();
          }

          if (aVal < bVal) return currentState === "asc" ? -1 : 1;
          if (aVal > bVal) return currentState === "asc" ? 1 : -1;
          return 0;
        });

        // reanexa na nova ordem
        tbody.innerHTML = "";
        rows.forEach(row => tbody.appendChild(row));
      });
    });

    // Observação: se quiser que o clique inicial em "Rank" ordene do pior ao melhor (E->S)
    // ao invés de S->E, basta inverter os valores no objeto rankValue (ou trocar asc/desc inicial).