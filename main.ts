import { Plugin } from 'obsidian';

interface Candidate {
      cand_id: number,
      party_name: string,
      party_id: number,
      first_name: string,
      last_name: string,
      incumbent: boolean,
      votes: number,
      percentage: number,
      called: boolean,
      electoral_votes_total: number
}

export default class UsaElec2024 extends Plugin {
	statusbar: HTMLElement

	async onload() {
		this.statusbar = this.addStatusBarItem();
		await this.updateInfo()

		this.registerInterval(window.setInterval(() => this.updateInfo(), 60 * 1000));
	}

	onunload() {

	}

	async updateInfo() {
		const url = "https://data.ddhq.io/electoral_college/2024"
		try {
			const res = await fetch(url)
			if (!res.ok) {
				throw new Error(`Request Failed: ${res.status}`)
			}
			const resJson = await res.json()
			const candidates = resJson.candidates
			const trump = candidates.find((elem: Candidate) => elem["last_name"] === "Trump")
			const harris = candidates.find((elem: Candidate) => elem["last_name"] === "Harris")
			this.statusbar.setText(`Harris (${harris.electoral_votes_total}) - (${trump.electoral_votes_total}) Trump`);
		} catch (e) {
			console.error(e)
			this.statusbar.setText(`Request Failed`);
		}
	}
}

