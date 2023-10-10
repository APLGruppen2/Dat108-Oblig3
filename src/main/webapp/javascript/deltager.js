
class DeltagerManager {

	#regElm;
	#statElm;
	#finndeltagerElm;
	#regInput;

	#Deltager = [];
	#besttid = '23:59:59';

	#resultatReg;
	#statInput;
	#statInput2;
	#resultatStat;
	#finnInput;
	#resultatFinn;
	#resultatFinn2;


	constructor(root) {
		this.#regElm = root.getElementsByClassName("registrering")[0];

		const regButton = this.#regElm.getElementsByTagName("button")[0];
		regButton.addEventListener("click", () => { this.#registrerdeltager() });

		this.#statElm = root.getElementsByClassName("statistikk")[0];
		const statButton = this.#statElm.getElementsByTagName("button")[0];
		statButton.addEventListener("click", () => { this.#beregnstatistikk() });

		this.#finndeltagerElm = root.getElementsByClassName("deltager")[0];
		const deltagerButton = this.#finndeltagerElm.getElementsByTagName("button")[0];
		deltagerButton.addEventListener("click", () => { this.#finndeltager() });

		// Fyll evt. inn mer kode
		this.#regInput = this.#regElm.getElementsByTagName("input")[0];

		this.#resultatReg = this.#regElm.getElementsByTagName("div")[1];

		this.#finnInput = this.#finndeltagerElm.getElementsByTagName("input")[0];
		this.#resultatFinn = this.#finndeltagerElm.getElementsByTagName("dl")[0];
		this.#resultatFinn2 = this.#finndeltagerElm.getElementsByTagName("p")[0];

		this.#statInput = this.#statElm.getElementsByTagName("input")[0];
		this.#statInput2 = this.#statElm.getElementsByTagName("input")[1];
		this.#resultatStat = this.#statElm.getElementsByTagName("p")[0];
	}
	#finndeltager() {
        // Fyll inn kode
        const input = this.#finnInput.value;
        const startnummer = parseInt(input);

        //Gir feil om input er tom
        if (input === "") {
            this.#finnInput.setCustomValidity("Null");
        } else {
            this.#finnInput.setCustomValidity("");
        }

        //Om input er valid utfører kode (resten av validering er allerede byggdinn i den type input)
        if (this.#finnInput.validity.valid === true) {
            const deltager = this.getDeltager(startnummer);
            //Sjekker om deltager eksisterer
            if (deltager === null) {
                this.#resultatFinn2.classList.remove("hidden", "resultatmangler");
            } else {
                this.#resultatFinn2.classList.add("hidden", "resultatmangler");
            }

            //Hvis deltager eksisterer
            if (deltager !== null) {
                this.#resultatFinn.getElementsByTagName("dd")[0].textContent = deltager.start;
                this.#resultatFinn.getElementsByTagName("dd")[1].textContent = deltager.time;
                this.#resultatFinn.getElementsByTagName("dd")[2].textContent = deltager.name;
                this.#resultatFinn.classList.remove("hidden", "resultatok");
            } else {
                this.#resultatFinn.classList.add("hidden", "resultatok");
            }

        } else {
            this.#resultatFinn2.classList.add("hidden", "resultatmangler");
            this.#resultatFinn.classList.add("hidden", "resultatok");
        }

    }


    #beregnstatistikk() {
        // Fyll inn kode
        let input = this.#statInput.value;
        let input2 = this.#statInput2.value;

        //Gir input standard verdi om ikke noe annet er oppgitt
        if (input === "") {
            input = "00:00:00"
        }
        if (input2 === "") {
            input2 = "23:59:59"
        }

        //Sjekkom om fra tid er mindre enn til tid
        if (input > input2) {
            this.#statInput.setCustomValidity('"Fra" verdi må være mindre enn "til" verdi');
            this.#statInput2.setCustomValidity('"Til" verdi må være større enn "fra" verdi');
        } else {
            this.#statInput.setCustomValidity("");
            this.#statInput2.setCustomValidity("");
        }
        this.#statInput.reportValidity();
        this.#statInput2.reportValidity();

        //Om input valid
        if (this.#statInput.validity.valid === true && this.#statInput2.validity.valid === true) {
            const antallDeltagere = this.getAntallDeltagere(input, input2);
			
            this.#resultatStat.getElementsByTagName("span")[0].textContent = antallDeltagere;
            this.#resultatStat.getElementsByTagName("span")[1].textContent = input;
            this.#resultatStat.getElementsByTagName("span")[2].textContent = input2;
            this.#resultatStat.classList.remove("hidden", "resultat");

        } else {
            this.#resultatStat.classList.add("hidden", "resultat");
        }


    }

	#registrerdeltager() {

		const input = this.#regInput.value;

		const tidReg = /(?:\d{0,2}:){2}\d{0,2}/g;
        const startnummerReg = /\d{1,3}/g;
        const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;

		var tid = input.match(tidReg);
		var inputUtenTid = input.replace(tidReg, "").trim();
		var startnummer = inputUtenTid.match(startnummerReg);
		var navn = inputUtenTid.match(navnReg);

		console.log(tid, startnummer, navn);

		if (!tid) {
			this.#regInput.setCustomValidity("Angi en gyldig tid")
		} else if (tid.length > 1) {
			this.#regInput.setCustomValidity("Angi kun en enkelt slutt tid")
		} else if (!startnummer) {
			this.#regInput.setCustomValidity("Angi et gyldig startnummer")
		} else if (!navn || navn.length < 2) {
			this.#regInput.setCustomValidity("Deltager må ha fornavn og etternavn")
		} else if (navn.some(n => n.length < 2)) {
			this.#regInput.setCustomValidity("Navn må være minst 2 bokstaver")
		} else if (input.includes("!") || input.includes("#")) {
			this.#regInput.setCustomValidity("Ulovlig tegn i input: !&#")
		} else {
			this.#regInput.setCustomValidity("");
		}
		this.#regInput.reportValidity();

		if (this.#regInput.validity.valid === true) {
			const time = tid[0].split(":").map(deler => deler.padStart(2, '0')).join(":");
			const start = parseInt(startnummer);
			const name = navn.map(nm => nm.split('-').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join("-")).join(" ");


			if (time === "00:00:00") {
				this.#regInput.setCustomValidity("Slutt tiden må være større enn 0 sekunder");
			} else if (startnummer.length > 1) {
				this.#regInput.setCustomValidity("Angi kun ett startnummer");
			} else if (this.getDeltager(start) !== null) {
				this.#regInput.setCustomValidity(`Startnummer  ${startnummer} er allerede i bruk`);
			} else {
				this.#regInput.setCustomValidity("");
			}
			this.#regInput.reportValidity();

			if (this.#regInput.validity.valid === true) {
				if (this.#besttid > time) {
					this.#besttid = time;
				} const deltager = { start, time, name }
				this.#Deltager.push(deltager);

				this.#regInput.value = " ";

				this.#resultatReg.getElementsByTagName("span")[0].textContent = this.#besttid;
				this.#resultatReg.classList.remove("hidden", "resultat");

			}
		} else {
			this.#resultatReg.classList.add("hidden", "resultat");
		}
	}
		
	getDeltager(startnummer){
		return this.#Deltager.find(deltager => deltager.start === startnummer) || null;
	}
	
	getAntallDeltagere(fra, til) {
		return this.#Deltager.filter(deltager => deltager.time >= fra && deltager.time <= til).length;
	}
	
}

// Fyll inn evt. hjelpemetoder


const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);