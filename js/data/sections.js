/**
 * ARTICLE III — BILL OF RIGHTS
 * 1987 Constitution of the Republic of the Philippines
 *
 * `text` is the verbatim constitutional text, cross-checked against three
 * independent sources (ChanRobles Virtual Law Library, The LawPhil Project,
 * and the University of Minnesota Human Rights Library transcription).
 * Everything else on each record is commentary written for study.
 *
 * Case citations are given by common name and year. They are study pointers,
 * not a substitute for reading the reports.
 */

import { CLUSTER_OF } from './clusters.js';

const RAW = [
  /* ─────────────────────────────────────────────────────────── I ─── */
  {
    n: 1,
    title: 'Due Process & Equal Protection',
    short: 'Due Process',
    kicker: 'The two clauses on which everything else rests',
    text: [
      { label: '', body: 'No person shall be deprived of life, liberty, or property without due process of law, nor shall any person be denied the equal protection of the laws.' },
    ],
    plain:
      'Government may take your life, your freedom, or your property — but only through a fair procedure, and only for a legitimate reason. And when it makes rules, it must treat people in the same situation the same way. Note the words: <em>no person</em>. Not "no citizen". The clause covers foreigners, and covers corporations as to property.',
    why:
      'Inherited from the Fourteenth Amendment by way of the Philippine Bill of 1902, and carried through the 1935 and 1973 charters. It is deliberately open-ended. The framers wanted one guarantee broad enough to catch abuses they could not name in advance — which is why almost every constitutional argument in Philippine law can be restated as a due process argument.',
    doctrines: [
      { name: 'Procedural due process', body: 'The <em>how</em>: notice, a genuine opportunity to be heard, an impartial tribunal, and a judgment supported by evidence presented at the hearing.' },
      { name: 'Substantive due process', body: 'The <em>what</em>: the law itself must pursue a lawful objective, through means reasonably necessary to that objective and not unduly oppressive.' },
      { name: 'Reasonable classification', body: 'Equal protection permits unequal treatment if the classification (1) rests on substantial distinctions, (2) is germane to the purpose of the law, (3) is not limited to existing conditions only, and (4) applies equally to all members of the class.' },
      { name: 'Levels of scrutiny', body: 'Rational basis for ordinary economic regulation. Strict scrutiny — a compelling state interest, narrowly drawn — when a fundamental right or a suspect classification is at stake.' },
      { name: 'Void for vagueness', body: 'A penal law so unclear that people of common intelligence must guess at its meaning denies due process, because it gives no fair warning and invites arbitrary enforcement.' },
    ],
    cases: [
      { name: 'Ang Tibay v. Court of Industrial Relations', year: '1940', holding: 'Laid down the seven cardinal primary rights of administrative due process — the standard still applied to every agency hearing in the country.' },
      { name: 'People v. Cayat', year: '1939', holding: 'The four-part test for a valid classification under the equal protection clause.' },
      { name: 'Ichong v. Hernandez', year: '1957', holding: 'Upheld the Retail Trade Nationalization Law. Citizenship was a substantial distinction germane to the purpose of the statute.' },
      { name: 'White Light Corp. v. City of Manila', year: '2009', holding: 'Struck down Manila\'s ban on short-time motel rates. The ordinance swept far more liberty into its net than its stated moral purpose required.' },
      { name: 'Ople v. Torres', year: '1998', holding: 'Voided the National Computerized Identification Reference System — created by executive order, without a law, and with no safeguards against the misuse of the data it would gather.' },
    ],
    real:
      'A public school teacher is dismissed by memorandum. She is never told exactly what she is accused of and never given a hearing. That is a procedural due process violation regardless of whether the accusation happens to be true — and the dismissal is void.',
    limits:
      'Due process is not a fixed formula. What it requires bends to context: a summary deportation, a school disciplinary board, and a murder trial each demand a different quantum of process. Equal protection likewise permits differential treatment whenever the four-part classification test is satisfied.',
  },

  /* ────────────────────────────────────────────────────────── II ─── */
  {
    n: 2,
    title: 'Searches & Seizures',
    short: 'Search & Seizure',
    kicker: 'The judge, personally — and no one else',
    text: [
      { label: '', body: 'The right of the people to be secure in their persons, houses, papers, and effects against unreasonable searches and seizures of whatever nature and for any purpose shall be inviolable, and no search warrant or warrant of arrest shall issue except upon probable cause to be determined personally by the judge after examination under oath or affirmation of the complainant and the witnesses he may produce, and particularly describing the place to be searched and the persons or things to be seized.' },
    ],
    plain:
      'The state cannot search you, your home, your papers, your phone or your things — or arrest you — unless a judge has personally found probable cause and issued a warrant that says exactly where to search and exactly what to seize.',
    why:
      'Read the 1973 version beside it. That charter allowed warrants issued by "such other responsible officer as may be authorized by law" — which, under martial law, meant the military. The 1987 framers wrote the words <em>personally by the judge</em> to shut that door permanently. It is the single most surgical edit in the whole article.',
    doctrines: [
      { name: 'Probable cause', body: 'Facts and circumstances that would lead a reasonably discreet and prudent person to believe an offence has been committed and that the objects sought are in the place to be searched.' },
      { name: 'Particularity', body: 'No general warrants, no "scatter-shot" warrants. A warrant authorising the seizure of "subversive documents" describes nothing and is void on its face.' },
      { name: 'Exclusionary rule', body: 'Read with §3(2): evidence obtained from an illegal search is the fruit of the poisonous tree, inadmissible for any purpose in any proceeding — and so is evidence derived from it.' },
      { name: 'Valid warrantless searches', body: 'Search incidental to a lawful arrest; plain view; search of a moving vehicle; consented search; customs search; stop-and-frisk; exigent circumstances. The list is exclusive and each has its own conditions.' },
      { name: 'Valid warrantless arrests', body: 'Rule 113 §5: <em>in flagrante delicto</em>; hot pursuit, where the officer has personal knowledge of facts indicating the arrestee committed an offence just concluded; and re-arrest of an escapee.' },
    ],
    cases: [
      { name: 'Stonehill v. Diokno', year: '1967', holding: 'Voided forty-two general warrants and adopted the exclusionary rule into Philippine law. The foundational case.' },
      { name: 'Burgos v. Chief of Staff', year: '1984', holding: 'The military raid on the We Forum newspaper. Warrants that fail to describe the things to be seized are void — decided while martial law\'s machinery was still standing.' },
      { name: 'Malacat v. Court of Appeals', year: '1997', holding: 'Stop-and-frisk requires a genuine reason grounded in the officer\'s experience, not a hunch and not a person\'s "moving eyes".' },
      { name: 'People v. Aruta', year: '1998', holding: 'An informant\'s tip alone does not supply probable cause for a warrantless search when there was ample time to get a warrant.' },
      { name: 'Valmonte v. De Villa', year: '1989', holding: 'Routine checkpoint stops with a visual search are reasonable; extensive searches of a vehicle\'s interior are not, absent probable cause.' },
    ],
    real:
      'Police at a checkpoint order a passenger to open his backpack. No warrant, no consent, nothing in plain view. Whatever they find is inadmissible — and in most drug prosecutions, the case collapses with the evidence.',
    limits:
      'The right is personal: only the person whose right was violated may object to the evidence. It can be waived by voluntary consent, though the state carries the burden of proving that consent was real and not mere submission to authority.',
  },

  /* ───────────────────────────────────────────────────────── III ─── */
  {
    n: 3,
    title: 'Privacy of Communication',
    short: 'Privacy',
    kicker: 'And the rule that makes §2 and §3 bite',
    text: [
      { label: '(1)', body: 'The privacy of communication and correspondence shall be inviolable except upon lawful order of the court, or when public safety or order requires otherwise, as prescribed by law.' },
      { label: '(2)', body: 'Any evidence obtained in violation of this or the preceding section shall be inadmissible for any purpose in any proceeding.' },
    ],
    plain:
      'Your letters, calls, messages and correspondence are private. The state may only intercept them with a court order, or where a statute says public safety requires it. And paragraph 2 is the enforcement engine: anything taken in violation of §2 or §3 cannot be used, in any case, for any purpose.',
    why:
      'Paragraph 2 is what turns two paper guarantees into operative law. A right with no remedy is a suggestion. By making the illegally obtained evidence useless, the framers removed the incentive to obtain it.',
    doctrines: [
      { name: 'Two exceptions only', body: '(a) a lawful court order, or (b) where public safety or order requires — <em>as prescribed by law</em>. The executive cannot invoke the second on its own say-so; it needs a statute.' },
      { name: 'Fruit of the poisonous tree', body: 'The exclusion extends to derivative evidence. A confession or a seizure that would not have happened but for the illegal act falls with it.' },
      { name: 'Reasonable expectation of privacy', body: 'The two-part test: the person exhibited an actual expectation of privacy, and that expectation is one society recognises as reasonable.' },
      { name: 'RA 4200 (Anti-Wiretapping Act)', body: 'Recording a private conversation without the consent of <em>all</em> parties is a criminal offence, and the recording is inadmissible — even if the recorder was a participant.' },
      { name: 'Writ of habeas data', body: 'A Supreme Court remedy (2008) for a person whose right to informational privacy is violated by the gathering or storing of data about them.' },
    ],
    cases: [
      { name: 'Zulueta v. Court of Appeals', year: '1996', holding: 'A wife who forced open her husband\'s cabinet and took his documents could not use them in evidence. Marriage does not dissolve the privacy of the spouses from each other.' },
      { name: 'Ramirez v. Court of Appeals', year: '1995', holding: 'Even a party to a private conversation violates RA 4200 by secretly recording it. The statute says "any person", and means it.' },
      { name: 'Gaanan v. Intermediate Appellate Court', year: '1986', holding: 'Listening on an extension telephone is not "tapping" — an extension line is not among the devices RA 4200 enumerates.' },
      { name: 'Disini v. Secretary of Justice', year: '2014', holding: 'Struck down the real-time collection of traffic data under the Cybercrime Prevention Act: "due cause" was undefined and the power was unchecked.' },
    ],
    real:
      'An employee secretly records a private conversation with a manager and offers it in a labour case. Under Ramirez, the recording is not only inadmissible — making it was a crime.',
    limits:
      'The clause binds the state directly, but RA 4200 and the Civil Code extend comparable protection between private persons. It does not shield what you knowingly expose to the public, and it does not cover the outward addressing information a service provider legitimately holds.',
  },

  /* ────────────────────────────────────────────────────────── IV ─── */
  {
    n: 4,
    title: 'Speech, Press, Assembly, Petition',
    short: 'Free Expression',
    kicker: '"No law shall be passed" — the flattest command in the article',
    text: [
      { label: '', body: 'No law shall be passed abridging the freedom of speech, of expression, or of the press, or the right of the people peaceably to assemble and petition the government for redress of grievances.' },
    ],
    plain:
      'Congress may not pass a law that abridges what you say, write, publish, perform, or protest about. This is the clause behind every journalist, student paper, striking union, artist and placard in the country.',
    why:
      'Under martial law the presses were padlocked, broadcast franchises revoked and handed to cronies, and rallies dispersed on sight. The 1987 clause is phrased as an absolute prohibition on the legislature rather than a grant to the citizen — the burden sits on the state from the first word.',
    doctrines: [
      { name: 'Prior restraint', body: 'Official restriction <em>before</em> publication or utterance carries a heavy presumption of unconstitutionality. The state must overcome it, not the speaker.' },
      { name: 'Clear and present danger', body: 'The dominant Philippine test: speech may be punished only where it creates a substantive evil the state has a right to prevent, and that danger is both serious and imminent.' },
      { name: 'Content-based vs. content-neutral', body: 'A restriction aimed at <em>what</em> is said faces strict scrutiny. One aimed only at time, place and manner faces intermediate scrutiny and must leave open ample alternative channels.' },
      { name: 'Unprotected categories', body: 'Obscenity, defamation, fighting words, and incitement to imminent lawless action fall outside the guarantee — but the categories are narrow and the state must prove the speech is in one.' },
      { name: 'Assembly and BP 880', body: 'The Public Assembly Act requires a permit for public places, but a permit may be denied only on clear-and-present-danger grounds, denial must be in writing within 24 hours, and no permit at all is needed in a freedom park, a campus, or a private place.' },
    ],
    cases: [
      { name: 'Chavez v. Gonzales', year: '2008', holding: 'Government warnings that broadcasting the "Hello Garci" tapes could cost stations their licences were unconstitutional prior restraint.' },
      { name: 'Bayan v. Ermita', year: '2006', holding: 'Upheld BP 880 but struck down the "calibrated preemptive response" policy, restoring the standard of maximum tolerance.' },
      { name: 'Diocese of Bacolod v. COMELEC', year: '2015', holding: 'COMELEC could not order a church to take down its oversized "Team Buhay / Team Patay" tarpaulin. The size limits apply to candidates, not to private citizens speaking about them.' },
      { name: 'Disini v. Secretary of Justice', year: '2014', holding: 'Online libel is constitutional as to the original author, but unconstitutional as applied to those who merely receive the post and react to it.' },
      { name: 'Reyes v. Bagatsing', year: '1983', holding: 'A rally permit may be refused only on a showing of clear and present danger; the burden is on the licensing authority.' },
    ],
    real:
      'A campus paper publishes an investigation into a mayor\'s procurement deals. The mayor\'s office privately warns the school that its permits are "under review" unless the story is pulled. That is prior restraint by proxy, and presumptively void.',
    limits:
      'Not absolute. Defamation, obscenity and incitement remain punishable after the fact. Government may regulate the time, place and manner of assembly. Speech inside a public school, a courtroom or a workplace is governed by narrower rules than speech in the street.',
  },

  /* ─────────────────────────────────────────────────────────── V ─── */
  {
    n: 5,
    title: 'Religious Freedom',
    short: 'Religion',
    kicker: 'Non-establishment, free exercise, and no religious test',
    text: [
      { label: '', body: 'No law shall be made respecting an establishment of religion, or prohibiting the free exercise thereof. The free exercise and enjoyment of religious profession and worship, without discrimination or preference, shall forever be allowed. No religious test shall be required for the exercise of civil or political rights.' },
    ],
    plain:
      'The state may not establish an official religion, fund one, or prefer one over another — and it may not stop you from practising yours. No one may be made to profess a belief in order to hold office, vote, or exercise any civil right.',
    why:
      'The Philippines is overwhelmingly Catholic and was governed for three centuries under a union of church and state, where the parish priest was also an instrument of the colonial administration. The clause keeps the majority faith out of the machinery of government, and keeps government out of the conscience of the minority. Article VI §29(2) reinforces it: no public money for any sect.',
    doctrines: [
      { name: 'Two clauses, one purpose', body: 'Non-establishment forbids state sponsorship. Free exercise forbids state interference. They pull against each other, and the space between them is where the litigation happens.' },
      { name: 'Belief vs. conduct', body: 'Freedom to <em>believe</em> is absolute. Freedom to <em>act</em> on that belief may be regulated where it collides with the rights of others or with public order.' },
      { name: 'Benevolent neutrality', body: 'The Philippine posture, adopted in Escritor: the state is not indifferent but accommodating. It may carve out exemptions for religious conscience rather than enforce a rigid wall.' },
      { name: 'Compelling state interest test', body: 'To burden a sincere religious exercise, the state must show (1) a sincere belief burdened, (2) a compelling state interest, and (3) that no less restrictive means exist.' },
      { name: 'No religious test', body: 'Distinct from the other two, and absolute. Belief may never be a condition for a civil or political right.' },
    ],
    cases: [
      { name: 'Estrada v. Escritor', year: '2003 · 2006', holding: 'A court employee living under a Jehovah\'s Witness "Declaration of Pledging Faithfulness" was exempted from immorality charges. The Court adopted benevolent neutrality and the compelling state interest test.' },
      { name: 'Ebralinag v. Division Superintendent of Schools', year: '1993', holding: 'Jehovah\'s Witness students cannot be expelled for refusing to salute the flag, sing the anthem, or recite the pledge. Reversed the contrary 1959 ruling in Gerona.' },
      { name: 'American Bible Society v. City of Manila', year: '1957', holding: 'A licence fee imposed on the distribution of bibles is an unconstitutional burden on the free exercise of religion.' },
      { name: 'Aglipay v. Ruiz', year: '1937', holding: 'A postage stamp marking an International Eucharistic Congress was valid. The purpose was to promote tourism; the benefit to religion was incidental.' },
      { name: 'Imbong v. Ochoa', year: '2014', holding: 'The Reproductive Health Law was largely upheld, but provisions compelling conscientious objectors to refer patients elsewhere were struck down as a violation of free exercise.' },
    ],
    real:
      'A government hospital orders a nurse to assist in a procedure her faith forbids, with no alternative offered and no other staff consulted. Under Escritor the state must show a compelling interest and that no gentler arrangement was available.',
    limits:
      'Belief is absolute; conduct is not. Practices that injure others, defraud, or violate laws of general application remain punishable regardless of sincerity — and the state may test whether the belief asserted is sincerely held.',
  },

  /* ────────────────────────────────────────────────────────── VI ─── */
  {
    n: 6,
    title: 'Liberty of Abode & Right to Travel',
    short: 'Abode & Travel',
    kicker: 'Two rights, two different keys',
    text: [
      { label: '', body: 'The liberty of abode and of changing the same within the limits prescribed by law shall not be impaired except upon lawful order of the court. Neither shall the right to travel be impaired except in the interest of national security, public safety, or public health, as may be provided by law.' },
    ],
    plain:
      'You may live where you choose and move where you choose. Your residence can only be restricted by a court order. Your travel can only be restricted for national security, public safety or public health — and only under a law.',
    why:
      'Look closely at the two halves: they are locked with different keys. Liberty of abode needs a <em>court order</em>. The right to travel needs a <em>statute</em>. In neither case can an executive official act alone — which is precisely how the 1987 framers wanted it, after a decade of administrative exile and travel bans.',
    doctrines: [
      { name: 'Different limitation clauses', body: '"Lawful order of the court" for abode. "As may be provided by law" for travel. Getting these two backwards is the most common error on this section.' },
      { name: 'Hold Departure Orders', body: 'Valid only when issued by a court with jurisdiction over a pending criminal case (SC Circular No. 39-97). An agency cannot manufacture one.' },
      { name: 'The right to return is separate', body: 'Not part of the right to travel and not found in Article III at all. Marcos v. Manglapus located it in the general residual powers of the President to protect national interest.' },
      { name: 'Public health as a ground', body: 'Quarantine and movement restrictions are constitutionally available — but they must still trace back to a statute, not merely to a circular or a task force resolution.' },
    ],
    cases: [
      { name: 'Marcos v. Manglapus', year: '1989', holding: 'The Aquino government could bar the return of the Marcos family. The right to return is distinct from the right to travel and yields to the President\'s duty to protect the general welfare.' },
      { name: 'Genuino v. De Lima', year: '2018', holding: 'DOJ Circular No. 41, under which the Secretary of Justice issued watchlist and hold-departure orders, was struck down. There was no law authorising it, and the Constitution requires one.' },
      { name: 'Silverio v. Court of Appeals', year: '1991', holding: 'A court may restrain the travel of an accused as a condition of bail; the right yields to the court\'s jurisdiction over a pending case.' },
    ],
    real:
      'A person with no case filed against them is stopped at NAIA because their name appears on an agency watchlist. After Genuino, an executive-created list is not a law, and the restraint on their departure is void.',
    limits:
      'A court may condition bail on remaining in the country. Persons with pending criminal cases may be barred from leaving. Public health emergencies may justify sweeping restrictions — provided a statute supports them.',
  },

  /* ───────────────────────────────────────────────────────── VII ─── */
  {
    n: 7,
    title: 'Right to Information',
    short: 'Information',
    kicker: 'Transparency is the rule; secrecy must be justified',
    text: [
      { label: '', body: 'The right of the people to information on matters of public concern shall be recognized. Access to official records, and to documents and papers pertaining to official acts, transactions, or decisions, as well as to government research data used as basis for policy development, shall be afforded the citizen, subject to such limitations as may be provided by law.' },
    ],
    plain:
      'You may demand access to government records, contracts, decisions, and the research behind policy. You do not have to explain why you want them. Secrecy is the exception, and the government carries the burden of justifying it.',
    why:
      'A martial-law state runs on undisclosed decrees and hidden contracts. The framers made access a right rather than a courtesy, and paired it with Article II §28, which imposes on the state a positive policy of full public disclosure of all transactions involving public interest.',
    doctrines: [
      { name: 'Self-executing', body: 'The right may be invoked and enforced by mandamus even without an implementing statute. Legaspi settled this in the Constitution\'s first year.' },
      { name: '"Matters of public concern"', body: 'Deliberately undefined. Determined case by case — the Court has said it embraces anything in which the public has a legitimate interest, which is a wide net.' },
      { name: 'Recognised exceptions', body: 'National security and military secrets; trade secrets and banking transactions; criminal matters under investigation; diplomatic correspondence; closed-door Cabinet deliberations; and executive privilege.' },
      { name: 'Executive privilege is presumptive, not absolute', body: 'It must be formally and specifically invoked, with the ground stated. A blanket claim covering an entire hearing is void.' },
      { name: 'Access, not compilation', body: 'The duty is to open existing records. An agency need not research, summarise, or create a new document to answer a request.' },
    ],
    cases: [
      { name: 'Legaspi v. Civil Service Commission', year: '1987', holding: 'A citizen may compel disclosure of civil service eligibility records by mandamus. The right is self-executing and needs no showing of personal interest.' },
      { name: 'Valmonte v. Belmonte', year: '1989', holding: 'GSIS had to disclose the loan guarantees extended to members of the Batasang Pambansa. Public funds carry public accountability.' },
      { name: 'Chavez v. PCGG', year: '1998', holding: 'The public may know the terms of a proposed compromise over the recovery of ill-gotten Marcos wealth, even while negotiations are ongoing.' },
      { name: 'Neri v. Senate Committee', year: '2008', holding: 'Certain conversations with the President are covered by presidential communications privilege, which the Senate\'s power of inquiry does not automatically defeat.' },
      { name: 'Sereno v. Committee on Trade and Related Matters', year: '2016', holding: 'Deliberative process privilege shields internal policy drafts and recommendations, so that officials can advise candidly.' },
    ],
    real:
      'A resident asks the barangay for the contract behind a covered court that cost four million pesos. The barangay must produce it — a public works contract paid from public funds is the paradigm case of a matter of public concern.',
    limits:
      'There is still no general Freedom of Information Act. Executive Order No. 2 (2016) implements the right, but binds only the executive branch. The clause also gives you the information; it does not oblige the government to act on it.',
  },

  /* ──────────────────────────────────────────────────────── VIII ─── */
  {
    n: 8,
    title: 'Right to Form Associations',
    short: 'Association',
    kicker: 'Including — expressly — government workers',
    text: [
      { label: '', body: 'The right of the people, including those employed in the public and private sectors, to form unions, associations, or societies for purposes not contrary to law shall not be abridged.' },
    ],
    plain:
      'You may join or form a union, an association or a society — in the private sector or in government — for any purpose that is not illegal. You may also refuse to join one.',
    why:
      'The phrase "including those employed in the public and private sectors" is new in 1987. It settled an argument that had run for decades over whether government employees had the right to organise at all. They do. What they still do not have is the right to strike.',
    doctrines: [
      { name: 'The negative aspect', body: 'The right to form an association includes the right not to join one, and to withdraw from one.' },
      { name: 'Public sector: organise, do not strike', body: 'Government employees may unionise and negotiate terms not fixed by law, but may not withhold public services. Executive Order No. 180 governs the mechanism.' },
      { name: '"Purposes not contrary to law"', body: 'The limit runs to unlawful <em>objects</em>, not to unpopular ones. An association cannot be banned because the government dislikes its politics.' },
      { name: 'Union security clauses', body: 'Closed-shop and union-shop agreements are valid, subject to the statutory exemption for members of religious sects that forbid union membership.' },
    ],
    cases: [
      { name: 'SSS Employees Association v. Court of Appeals', year: '1989', holding: 'Government employees have the constitutional right to organise, but no right to strike; the terms of their employment are fixed by law, not bargaining.' },
      { name: 'Victoriano v. Elizalde Rope Workers\' Union', year: '1974', holding: 'RA 3350, exempting members of religious sects that prohibit union membership from closed-shop agreements, is a valid accommodation and not an establishment of religion.' },
      { name: 'In re Edillon', year: '1978', holding: 'Compulsory membership in the Integrated Bar does not violate freedom of association; it is an exercise of the Supreme Court\'s power to regulate the legal profession.' },
    ],
    real:
      'Nurses at a government hospital form an association to negotiate scheduling and hazard pay. That is fully protected. If they walk out of the wards to press the demand, the protection ends and administrative liability begins.',
    limits:
      'No right to strike in the public sector. Associations formed for unlawful purposes enjoy no protection. And professions may be required to organise under a regulatory body.',
  },

  /* ────────────────────────────────────────────────────────── IX ─── */
  {
    n: 9,
    title: 'Eminent Domain & Just Compensation',
    short: 'Just Compensation',
    kicker: 'This clause does not grant the power. It prices it.',
    text: [
      { label: '', body: 'Private property shall not be taken for public use without just compensation.' },
    ],
    plain:
      'The government can take your land for a public purpose — but it must pay you the full and fair value of what it took, measured at the time of the taking, and it must pay promptly.',
    why:
      'Eminent domain is an inherent power of the state; it exists with or without a constitution. This clause is therefore not a grant but a restriction. Its two conditions — <em>public use</em> and <em>just compensation</em> — are the only things standing between the state and your title.',
    doctrines: [
      { name: 'The five requisites of a taking', body: 'From Castellvi: (1) the expropriator enters the property; (2) the entry is for more than a momentary period; (3) it is under warrant or colour of legal authority; (4) the property is devoted to public use; and (5) the owner is ousted from beneficial enjoyment.' },
      { name: 'Just compensation defined', body: 'The full and fair equivalent of the property taken — measured by the <em>owner\'s loss</em>, not the taker\'s gain. "Just" also imports promptness: compensation long delayed is not just.' },
      { name: 'A judicial function', body: 'Only the courts may finally determine just compensation. A legislated valuation formula may guide, but cannot bind, the court.' },
      { name: '"Public use" read broadly', body: 'It no longer means use <em>by</em> the public. It now means public benefit, advantage or welfare — which is how socialised housing and agrarian reform qualify.' },
      { name: 'Regulatory taking', body: 'A regulation that deprives an owner of all economically beneficial use can amount to a compensable taking, even without physical entry.' },
    ],
    cases: [
      { name: 'Republic v. Vda. de Castellvi', year: '1974', holding: 'Set the five requisites of a compensable taking, and fixed valuation at the time of taking rather than the time of filing.' },
      { name: 'EPZA v. Dulay', year: '1987', holding: 'Presidential Decrees fixing just compensation at the assessor\'s value were void. Determining just compensation is inherently judicial; the legislature cannot usurp it.' },
      { name: 'Association of Small Landowners v. Secretary of Agrarian Reform', year: '1989', holding: 'Upheld the Comprehensive Agrarian Reform Program. Compensation partly in bonds and stock was acceptable given the unprecedented scale of the undertaking.' },
      { name: 'Republic v. Gingoyon', year: '2005', holding: 'The government had to pay before taking over NAIA Terminal 3. Possession follows payment, not the reverse.' },
    ],
    real:
      'A road-widening project takes two metres off a family\'s frontage. They are entitled to the market value of that strip <em>plus</em> consequential damages to what remains — and the amount is set by a court, not by the implementing agency\'s own appraisal.',
    limits:
      'The state may take possession early upon deposit of the assessed value, but ownership transfers only on full payment. Interest runs on delayed compensation, and the owner keeps the right to contest the valuation throughout.',
  },

  /* ─────────────────────────────────────────────────────────── X ─── */
  {
    n: 10,
    title: 'Non-Impairment of Contracts',
    short: 'Contracts',
    kicker: 'The weakest clause in the article — and worth knowing why',
    text: [
      { label: '', body: 'No law impairing the obligation of contracts shall be passed.' },
    ],
    plain:
      'The legislature may not pass a law that changes the terms of contracts people have already entered into.',
    why:
      'Inherited from the American constitutional tradition to protect commercial expectations. In practice it is the least successful guarantee in Article III, because every contract is read as containing an unwritten reservation of the state\'s police power — and police power almost always wins.',
    doctrines: [
      { name: 'What counts as impairment', body: 'Anything that changes the terms of a contract, imposes new conditions, dispenses with those agreed, or withdraws a remedy the parties bargained for.' },
      { name: 'Police power prevails', body: 'Contracts are deemed to incorporate the state\'s reserved power to legislate for public health, safety, morals and general welfare. This is the doctrine that swallows the clause.' },
      { name: 'Franchises are not contracts', body: 'Under Article XII §11, every franchise, certificate or authorisation is subject to amendment, alteration or repeal by Congress when the common good requires.' },
      { name: 'Binds the legislature only', body: 'The prohibition runs against laws. A judicial decision interpreting a contract, however unwelcome, is not an impairment.' },
    ],
    cases: [
      { name: 'Ortigas & Co. v. Feati Bank', year: '1979', holding: 'A municipal zoning ordinance reclassifying land as commercial prevailed over the restrictive residential covenants written into the deed.' },
      { name: 'Rutter v. Esteban', year: '1953', holding: 'A debt moratorium reasonable in the immediate aftermath of the war became an unconstitutional impairment once extended eight years beyond it. Duration can turn a valid measure invalid.' },
      { name: 'Philippine Rural Electric Cooperatives Assn. v. DILG', year: '2003', holding: 'Withdrawing a tax exemption previously granted by statute is not an impairment; a tax exemption is a legislative grace, not a contract.' },
    ],
    real:
      'A law caps interest rates on loans already signed at a higher rate. If it is framed as a consumer-protection measure under the police power — and it almost always is — the clause will not save the lender.',
    limits:
      'Yields to police power, to the power of taxation, and to eminent domain. Do not build an argument on this clause alone; pair it with due process.',
  },

  /* ────────────────────────────────────────────────────────── XI ─── */
  {
    n: 11,
    title: 'Free Access to the Courts',
    short: 'Free Access',
    kicker: 'A right you cannot afford to enforce is not a right',
    text: [
      { label: '', body: 'Free access to the courts and quasi-judicial bodies and adequate legal assistance shall not be denied to any person by reason of poverty.' },
    ],
    plain:
      'Poverty may not be the reason you cannot go to court. Filing fees must be waivable and legal help must be available to those who cannot pay for it.',
    why:
      'Every other section in Article III presumes a forum. This one supplies it. Without §11, the guarantees above become the private property of people who can afford a lawyer — which, in a country where most litigants cannot, would empty most of the article.',
    doctrines: [
      { name: 'Natural persons only', body: 'The exemption is for human beings in poverty. A corporation or a foundation — however charitable its work — cannot claim it.' },
      { name: 'The indigency test', body: 'Rule 141 §19: gross household income not more than double the monthly minimum wage, and no real property with a fair market value above ₱300,000. The court may still verify.' },
      { name: 'Fees become a lien', body: 'An indigent litigant is exempt from docket and other lawful fees, but those fees attach as a lien on any judgment favourable to them.' },
      { name: 'Adequate — not nominal — assistance', body: 'The guarantee is of <em>adequate</em> legal assistance. A counsel <em>de oficio</em> appointed as a formality, who does not prepare or participate, does not satisfy it.' },
      { name: 'Statutory machinery', body: 'The Public Attorney\'s Office represents indigent litigants; RA 9999 (Free Legal Assistance Act of 2010) grants private lawyers a tax deduction for pro bono work.' },
    ],
    cases: [
      { name: 'Re: Query of Mr. Roger C. Prioreschi', year: '2009', holding: 'The Good Shepherd Foundation could not claim indigent-litigant exemption on behalf of the poor it served. The clause speaks of persons, and a juridical entity is not one.' },
      { name: 'People v. Holgado', year: '1950', holding: 'A trial court has an affirmative duty to inform an unrepresented accused of the right to counsel and to appoint one — not merely to ask whether he has a lawyer.' },
    ],
    real:
      'A domestic worker wants to sue for two years of unpaid wages but cannot cover the filing fee. She applies to litigate as an indigent. If the income and property tests are met, the fee is waived and the case proceeds.',
    limits:
      'Exemption from fees is not exemption from the rules. Deadlines, form and the burden of proof apply exactly as they would to any other litigant. And indigency must be proven, not merely asserted.',
  },

  /* ───────────────────────────────────────────────────────── XII ─── */
  {
    n: 12,
    title: 'Rights Under Custodial Investigation',
    short: 'Custodial Rights',
    kicker: 'The most direct answer to martial law in the entire article',
    text: [
      { label: '(1)', body: 'Any person under investigation for the commission of an offense shall have the right to be informed of his right to remain silent and to have competent and independent counsel preferably of his own choice. If the person cannot afford the services of counsel, he must be provided with one. These rights cannot be waived except in writing and in the presence of counsel.' },
      { label: '(2)', body: 'No torture, force, violence, threat, intimidation, or any other means which vitiate the free will shall be used against him. Secret detention places, solitary, incommunicado, or other similar forms of detention are prohibited.' },
      { label: '(3)', body: 'Any confession or admission obtained in violation of this or Section 17 hereof shall be inadmissible in evidence against him.' },
      { label: '(4)', body: 'The law shall provide for penal and civil sanctions for violations of this section as well as compensation to the rehabilitation of victims of torture or similar practices, and their families.' },
    ],
    note:
      'Paragraph (4) reads oddly — "compensation to the rehabilitation of victims" — and is frequently misquoted as "compensation to <em>and</em> rehabilitation of". The text above is the ratified wording as it actually appears.',
    plain:
      'From the moment you are under investigation for an offence and no longer free to walk away, the police must tell you that you may stay silent and that you are entitled to a lawyer — competent, independent, and free if you cannot pay. You can only give up those rights in writing, with a lawyer physically present. Torture and secret detention are banned outright, and anything extracted in violation of this is inadmissible.',
    why:
      'Read paragraph (2) again and notice how specific it is. "Secret detention places, solitary, incommunicado" is not abstract drafting — it names the actual practices of 1972–1986: safehouses, "salvaging", and disappearances. Paragraph (4) then orders Congress to criminalise it and to compensate the victims. Congress complied through RA 7438 (1992), RA 9745 (Anti-Torture Act, 2009), RA 10353 (Anti-Enforced or Involuntary Disappearance Act, 2012) and RA 10368 (Human Rights Victims Reparation Act, 2013).',
    doctrines: [
      { name: 'When the right attaches', body: 'From the moment the investigation stops being a general inquiry into an unsolved crime and begins to focus on a particular suspect who has been taken into custody. Not before.' },
      { name: 'The four guarantees', body: '(1) to be informed of these rights, (2) to remain silent, (3) to competent and independent counsel, and (4) against torture and coercion — all backed by the exclusionary rule in paragraph (3).' },
      { name: '"Competent and independent"', body: 'A lawyer with no conflicting loyalty, who is present throughout the questioning — not one summoned to sign the last page of a statement already taken.' },
      { name: 'Waiver formalities are jurisdictional', body: 'In writing <em>and</em> in the presence of counsel. A signed waiver without a lawyer present is void, and everything flowing from it falls.' },
      { name: 'What is not custodial investigation', body: 'A police line-up before charges focus on the suspect; an administrative or legislative inquiry; a spontaneous statement volunteered to a private person or the media and not elicited by investigators.' },
    ],
    cases: [
      { name: 'People v. Mahinay', year: '1999', holding: 'Restated the expanded Miranda warnings that Philippine officers must give — the standard checklist still taught and still litigated.' },
      { name: 'People v. Galit', year: '1985', holding: 'A confession taken after days of incommunicado detention, without counsel, is void. Decided while the practices it condemned were still routine.' },
      { name: 'Gamboa v. Cruz', year: '1988', holding: 'A police line-up is not custodial investigation; the right to counsel had not yet attached at that stage.' },
      { name: 'People v. Andan', year: '1997', holding: 'A confession freely volunteered to the town mayor and repeated to reporters was admissible. The rights guard against state interrogation, not against a person\'s own unprompted words.' },
      { name: 'People v. Bandula', year: '1994', holding: 'Counsel who was the municipal attorney — and therefore aligned with the prosecution — was not "independent". The confession was excluded.' },
    ],
    real:
      'A suspect is picked up in the evening, held overnight, and signs a confession at three in the morning. A lawyer is called in only to sign the final page. The confession is inadmissible, and in most cases the prosecution goes down with it.',
    limits:
      'These are <em>custodial</em> rights. They do not apply to a person volunteering information, to administrative or legislative hearings, or to statements made before the inquiry focused on the speaker as a suspect. The right against torture in paragraph (2), however, admits no exception at all.',
  },

  /* ──────────────────────────────────────────────────────── XIII ─── */
  {
    n: 13,
    title: 'The Right to Bail',
    short: 'Bail',
    kicker: 'Liberty is the rule; detention before conviction is the exception',
    text: [
      { label: '', body: 'All persons, except those charged with offenses punishable by reclusion perpetua when evidence of guilt is strong, shall, before conviction, be bailable by sufficient sureties, or be released on recognizance as may be provided by law. The right to bail shall not be impaired even when the privilege of the writ of habeas corpus is suspended. Excessive bail shall not be required.' },
    ],
    plain:
      'Before conviction you have a right to be released on bail. The single exception is where you are charged with an offence punishable by <em>reclusion perpetua</em> <strong>and</strong> the evidence of your guilt is strong — both conditions, not either one. Bail must also not be set so high that granting it is a denial in disguise.',
    why:
      'The middle sentence is a 1987 addition. Under martial law the suspension of habeas corpus was treated as suspending bail too, so detainees could be held indefinitely without either remedy. The framers wrote the two rights apart so that one could never be used to erase the other.',
    doctrines: [
      { name: 'Right vs. discretion', body: 'Before conviction and outside the exception, bail is a matter of <em>right</em>. After conviction by the trial court of a non-capital offence, it becomes a matter of judicial <em>discretion</em>.' },
      { name: 'The bail hearing is mandatory', body: 'Where the exception is invoked, the court must hold a summary hearing at which the prosecution bears the burden of showing that the evidence of guilt is strong. A judge who grants or denies bail without one is administratively liable.' },
      { name: 'Custody is a precondition', body: 'Bail presupposes detention. A person not in custody, actual or constructive, has nothing to be bailed from.' },
      { name: 'Fixing the amount', body: 'Rule 114 §9: financial ability, nature and circumstances of the offence, penalty, character and reputation, age and health, weight of the evidence, probability of appearing at trial, and any prior forfeiture of bail.' },
      { name: 'Excessive bail is its own violation', body: 'The third sentence is a separate guarantee. Bail set beyond the accused\'s means, without reference to the Rule 114 factors, is void even though it was nominally "granted".' },
    ],
    cases: [
      { name: 'Enrile v. Sandiganbayan', year: '2015', holding: 'Bail was granted to an elderly accused in frail health charged with plunder. The Court recognised humanitarian grounds and the reduced flight risk of the very ill.' },
      { name: 'Government of Hong Kong SAR v. Olalia', year: '2007', holding: 'A prospective extraditee may be admitted to bail. The right to liberty is not confined to criminal proceedings; it follows from due process.' },
      { name: 'De la Camara v. Enage', year: '1971', holding: 'Bail of ₱1,195,200 was so far beyond the accused\'s means as to be a denial of the right itself.' },
      { name: 'Leviste v. Court of Appeals', year: '2010', holding: 'Bail pending appeal after conviction of a non-capital offence is discretionary and may be denied on the enumerated grounds — recidivism, flight risk, or probability of further offences.' },
      { name: 'Comendador v. De Villa', year: '1991', holding: 'The right to bail does not extend to members of the armed forces facing court-martial; military necessity and the unique nature of military justice justify the exclusion.' },
    ],
    real:
      'A person charged with estafa earning ₱18,000 a month is told bail is ₱2,000,000. That is not bail; it is detention with extra paperwork, and it is challengeable under the excessive bail clause on its own.',
    limits:
      'Not available after final conviction, nor in courts-martial. Bail may be cancelled for breach of its conditions, and the accused\'s failure to appear forfeits the bond and can justify trial in absentia under §14(2).',
  },

  /* ───────────────────────────────────────────────────────── XIV ─── */
  {
    n: 14,
    title: 'Rights of the Accused at Trial',
    short: 'Fair Trial',
    kicker: 'The operating instructions for a criminal trial',
    text: [
      { label: '(1)', body: 'No person shall be held to answer for a criminal offense without due process of law.' },
      { label: '(2)', body: 'In all criminal prosecutions, the accused shall be presumed innocent until the contrary is proved, and shall enjoy the right to be heard by himself and counsel, to be informed of the nature and cause of the accusation against him, to have a speedy, impartial, and public trial, to meet the witnesses face to face, and to have compulsory process to secure the attendance of witnesses and the production of evidence in his behalf. However, after arraignment, trial may proceed notwithstanding the absence of the accused: Provided, that he has been duly notified and his failure to appear is unjustifiable.' },
    ],
    plain:
      'Criminal punishment requires due process. Once charged you are presumed innocent; you must be told exactly what you are accused of; you get a lawyer; the trial must be speedy, impartial and open; you may confront the witnesses against you and compel your own witnesses to appear.',
    why:
      'Paragraph (1) is due process restated for the criminal setting. Paragraph (2) then enumerates the specific guarantees that give it content — because a general promise of fairness, without a list, is what every authoritarian criminal procedure also claims to offer.',
    doctrines: [
      { name: 'Presumption of innocence', body: 'The state must prove guilt beyond reasonable doubt on the strength of its own evidence, never on the weakness of the defence. The accused may present nothing at all and still be entitled to acquittal.' },
      { name: 'Right to be informed', body: 'The Information must allege the acts constituting the offence, not merely name it. A person cannot be convicted of an offence not charged, however clearly the evidence proves it.' },
      { name: 'Confrontation', body: 'The accused must have had the opportunity to cross-examine. Testimony from a witness who was never cross-examined is stricken from the record.' },
      { name: 'Compulsory process', body: 'Subpoena <em>ad testificandum</em> for witnesses and <em>duces tecum</em> for documents — the mirror of the state\'s power, placed in the accused\'s hands.' },
      { name: 'Trial in absentia', body: 'Permitted after arraignment, on proof of due notice and unjustified absence. Introduced in 1973 to stop accused persons from stalling trials indefinitely by disappearing.' },
      { name: 'Speedy trial', body: 'RA 8493 and the Revised Guidelines for Continuous Trial fix the periods. Dismissal for violation has the effect of an acquittal and bars re-filing.' },
    ],
    cases: [
      { name: 'People v. Holgado', year: '1950', holding: 'The trial court must inform an unrepresented accused of the right to counsel, ask whether he wishes one, and appoint one if he cannot procure counsel himself.' },
      { name: 'Tatad v. Sandiganbayan', year: '1988', holding: 'A three-year, politically motivated delay in a preliminary investigation violated the rights to due process and to speedy disposition. The informations were dismissed.' },
      { name: 'Estrada v. Sandiganbayan', year: '2001', holding: 'The Plunder Law is not void for vagueness. "Combination or series of overt acts" is intelligible to a person of ordinary intelligence.' },
      { name: 'Alonte v. Savellano', year: '1998', holding: 'A conviction rendered without letting the accused cross-examine or present evidence is void, no matter how strong the case against him appeared.' },
    ],
    real:
      'A key witness gives a damning affidavit and then leaves the country before cross-examination. That affidavit cannot support a conviction — the accused never had the chance to confront her, and the testimony is struck.',
    limits:
      'The accused may waive the right to be present, the right to counsel (knowingly and intelligently), and the right of confrontation. The presumption of innocence does not bar statutory presumptions that rest on a rational connection to a proven fact.',
  },

  /* ────────────────────────────────────────────────────────── XV ─── */
  {
    n: 15,
    title: 'The Writ of Habeas Corpus',
    short: 'Habeas Corpus',
    kicker: 'Produce the body, and justify the detention',
    text: [
      { label: '', body: 'The privilege of the writ of habeas corpus shall not be suspended except in cases of invasion or rebellion, when the public safety requires it.' },
    ],
    plain:
      'The great writ compels whoever is holding a person to bring them before a judge and justify the detention. It can be suspended only for invasion or rebellion, and only when public safety actually requires it.',
    why:
      'Marcos suspended the writ in 1971 and again under martial law, and the courts of that era declined to look behind his factual basis. The 1987 Constitution kept the two grounds but stripped away everything else: Article VII §18 now caps a suspension at sixty days, requires a report to Congress within forty-eight hours, lets Congress revoke it by majority vote — a vote the President cannot veto — and gives the Supreme Court the power to review the sufficiency of the factual basis on the petition of <em>any citizen</em>.',
    doctrines: [
      { name: 'Two grounds only', body: 'Invasion and rebellion. The 1973 ground of "imminent danger thereof" was deliberately deleted in 1987.' },
      { name: 'Narrow application', body: 'A suspension applies only to persons judicially charged with rebellion, or with offences inherent in or directly connected with invasion. Everyone else keeps the writ.' },
      { name: 'The three-day rule', body: 'Anyone arrested during a suspension must be judicially charged within three days, or released.' },
      { name: 'Bail survives suspension', body: 'Section 13 says so expressly. Suspending the writ does not suspend the right to bail.' },
      { name: 'Justiciable, not political', body: 'Since Lansang, the courts may inquire into the factual basis. The 1987 Constitution then wrote that power into the text itself.' },
      { name: 'The companion writs', body: 'The Supreme Court created <em>amparo</em> (2007) for threats to life, liberty and security — reaching enforced disappearances the old writ could not — and <em>habeas data</em> (2008) for informational privacy.' },
    ],
    cases: [
      { name: 'Lansang v. Garcia', year: '1971', holding: 'Abandoned the political-question rule of Barcelon v. Baker. The Court may inquire whether the President acted arbitrarily in suspending the privilege.' },
      { name: 'Fortun v. Macapagal-Arroyo', year: '2012', holding: 'The Maguindanao martial law proclamation was lifted before Congress could act, mooting the petitions — an illustration of how short the constitutional clock now is.' },
      { name: 'Lagman v. Medialdea', year: '2017', holding: 'Upheld Proclamation No. 216 over Mindanao after the Marawi siege. The President\'s factual basis need only amount to probable cause, not proof beyond reasonable doubt.' },
    ],
    real:
      'A family cannot find a relative taken by armed men in plain clothes. They file for habeas corpus — and because the captors simply deny having him, they also file for the writ of <em>amparo</em>, which reaches enforced disappearances where a denial of custody would otherwise end the inquiry.',
    limits:
      'The writ does not lie once a person is held under valid judicial process or a final judgment. Its office is to test the legality of the restraint, not the guilt of the person restrained. Note too that what may be suspended is the <em>privilege</em> of the writ — courts still issue it; the return simply becomes conclusive.',
  },

  /* ───────────────────────────────────────────────────────── XVI ─── */
  {
    n: 16,
    title: 'Speedy Disposition of Cases',
    short: 'Speedy Disposition',
    kicker: 'Broader than §14 — and where Philippine cases actually die',
    text: [
      { label: '', body: 'All persons shall have the right to a speedy disposition of their cases before all judicial, quasi-judicial, or administrative bodies.' },
    ],
    plain:
      'Every case, in every forum — courts, the Ombudsman, the COMELEC, an administrative board — must be resolved without unreasonable delay. This right belongs to <em>all persons</em>, not only to the accused.',
    why:
      'Section 14(2)\'s speedy-trial guarantee covers only criminal prosecutions in court. Section 16 was written broader on purpose, because the real bottleneck is upstream: preliminary investigations and quasi-judicial proceedings, where a complaint can sit for years without anyone ever being formally tried.',
    doctrines: [
      { name: 'Wider than speedy trial', body: 'Applies to any party — complainant or respondent — in any tribunal: judicial, quasi-judicial or administrative.' },
      { name: 'The Cagang framework', body: 'The right must be timely invoked. The period runs from the filing of a formal complaint. If the delay is within the prescribed periods, the defence bears the burden of proving prejudice; if it exceeds them, the burden shifts to the prosecution to justify it.' },
      { name: 'Not arithmetic', body: 'Delay is measured against the complexity of the case, the conduct of both parties, and the prejudice suffered — not by counting months alone.' },
      { name: 'The remedy is fatal', body: 'Dismissal on this ground is equivalent to an acquittal and bars re-filing under §21.' },
      { name: 'Waiver', body: 'A party who sits on the right, or who causes the delay, cannot later complain of it.' },
    ],
    cases: [
      { name: 'Cagang v. Sandiganbayan', year: '2018', holding: 'The governing guidelines: when the period begins, who carries the burden, and when delay becomes inordinate. The controlling authority today.' },
      { name: 'Tatad v. Sandiganbayan', year: '1988', holding: 'Three years to complete a preliminary investigation, with evident political motivation, violated the right.' },
      { name: 'Duterte v. Sandiganbayan', year: '1998', holding: 'A four-year delay at the Ombudsman, with the respondents left in suspense throughout, warranted dismissal.' },
    ],
    real:
      'A graft complaint sits at the Ombudsman for six years before an Information is filed. Under Cagang the prosecution must now explain those six years — and if it cannot, the case is dismissed permanently.',
    limits:
      'The right is waived if not asserted at the proper time. Delay attributable to the party invoking it does not count, and a party who benefits from the delay cannot turn it into a defence.',
  },

  /* ──────────────────────────────────────────────────────── XVII ─── */
  {
    n: 17,
    title: 'Right Against Self-Incrimination',
    short: 'Self-Incrimination',
    kicker: 'The mind is protected. The body is evidence.',
    text: [
      { label: '', body: 'No person shall be compelled to be a witness against himself.' },
    ],
    plain:
      'You cannot be forced to say something that would help convict you. In a criminal case the accused may refuse to take the stand at all. Anyone else must take the stand, but may refuse to answer the specific question that would incriminate them.',
    why:
      'The clause exists to remove the incentive to extract truth by pressure. It works in tandem with §12: section 12 protects you in the police station, section 17 protects you in the witness box. Together they close the loop that torture was designed to exploit.',
    doctrines: [
      { name: 'Testimonial compulsion only', body: 'The privilege covers communication, not existence. Fingerprints, photographs, DNA, blood samples, being measured or made to stand for identification — all are object evidence and compellable.' },
      { name: 'The dividing line', body: 'An act requiring the use of the mind is protected; a purely mechanical or passive act is not. This is why you cannot be compelled to produce a handwriting specimen but can be compelled to submit to a physical examination.' },
      { name: 'Accused vs. ordinary witness', body: 'The accused may refuse to take the stand entirely. An ordinary witness must appear and object question by question.' },
      { name: 'Not limited to criminal cases', body: 'The privilege may be invoked in civil, administrative and legislative proceedings whenever the answer could expose the person to criminal liability.' },
      { name: 'Immunity statutes defeat it', body: 'A valid grant of use or transactional immunity removes the privilege, because the danger it guards against no longer exists.' },
    ],
    cases: [
      { name: 'Beltran v. Samson', year: '1929', holding: 'An accused cannot be compelled to write a specimen of his handwriting. Writing is a mental act, and to compel it is to compel testimony.' },
      { name: 'Villaflor v. Summers', year: '1920', holding: 'A woman charged with adultery could be compelled to submit to a physical examination. The body is object evidence, not testimony.' },
      { name: 'US v. Tan Teng', year: '1912', holding: 'A substance taken from the accused\'s body and analysed is admissible; no testimonial compulsion is involved.' },
      { name: 'Chavez v. Court of Appeals', year: '1968', holding: 'Calling the accused as the prosecution\'s <em>first witness</em> violated the privilege outright. The conviction was void and habeas corpus lay.' },
      { name: 'Standard Chartered Bank v. Senate Committee', year: '2007', holding: 'The privilege may be invoked in a legislative inquiry, but only as to specific incriminating questions — not as a blanket refusal to appear.' },
    ],
    real:
      'A driver in a hit-and-run is ordered to give a blood sample and to write out a statement of apology. The blood sample is compellable. The statement is not — and compelling it would taint everything that follows.',
    limits:
      'Corporations have no privilege, so corporate records can be compelled from their custodian. The privilege also disappears once the danger of prosecution has passed — after acquittal, after prescription, or after a grant of immunity.',
  },

  /* ─────────────────────────────────────────────────────── XVIII ─── */
  {
    n: 18,
    title: 'Political Belief & Involuntary Servitude',
    short: 'Belief & Servitude',
    kicker: 'No one is jailed for what they think, or made to work for another',
    text: [
      { label: '(1)', body: 'No person shall be detained solely by reason of his political beliefs and aspirations.' },
      { label: '(2)', body: 'No involuntary servitude in any form shall exist except as a punishment for a crime whereof the party shall have been duly convicted.' },
    ],
    plain:
      'You cannot be jailed for what you believe or for what you want your country to become. And no one may be forced to work for another against their will, unless it is punishment following a conviction.',
    why:
      'Paragraph (1) is a repudiation of the political detention that defined 1972–1986, when tens of thousands were held under Presidential Commitment Orders without charges. Paragraph (2) traces to the abolition of slavery — and still does real work today against debt bondage and trafficking, which are the forms involuntary servitude actually takes in the modern Philippines.',
    doctrines: [
      { name: '"Solely by reason of"', body: 'The operative word is <em>solely</em>. A person may still be detained for acts — rebellion, murder, arson — but never for the belief that motivated them.' },
      { name: 'What servitude covers', body: 'Peonage, debt bondage, and any condition where a person is compelled to labour by force, threat, fraud, or legal coercion.' },
      { name: 'The recognised exceptions', body: 'Punishment after conviction; military or civil service in defence of the state (Art. II §4); naval enlistment; <em>posse comitatus</em>; return-to-work orders in industries affected with public interest; and the duties owed within a family under <em>patria potestas</em>.' },
      { name: 'Statutory extension', body: 'RA 9208 as amended by RA 10364 (Anti-Trafficking in Persons Act) is where paragraph (2) is litigated today.' },
    ],
    cases: [
      { name: 'Caunca v. Salazar', year: '1949', holding: 'A housemaid restrained by an employment agency until she worked off her transport costs was unlawfully held. Freedom of locomotion cannot be pledged against a debt.' },
      { name: 'Kaisahan ng mga Manggagawa v. Gotamco Sawmills', year: '1949', holding: 'A return-to-work order in an industry affected with public interest is not involuntary servitude; the employment relation is not created by compulsion but resumed.' },
      { name: 'People v. Ferrer', year: '1972', holding: 'The Anti-Subversion Act survived a bill-of-attainder challenge because it still required judicial proof of knowing membership and overt acts. The statute was repealed in 1992; §18(1) now forecloses belief-based detention directly.' },
    ],
    real:
      'A recruiter holds a worker\'s passport until she "works off" her placement fee. That is not a contract term — it is involuntary servitude, and under RA 10364 it is trafficking in persons.',
    limits:
      'Prison labour after a valid conviction is expressly permitted. So is compulsory service in defence of the state. And a person may still be detained for criminal acts, however political their motivation.',
  },

  /* ───────────────────────────────────────────────────────── XIX ─── */
  {
    n: 19,
    title: 'Cruel Punishment & the Death Penalty',
    short: 'Punishment',
    kicker: 'The framers switched the default from on to off',
    text: [
      { label: '(1)', body: 'Excessive fines shall not be imposed, nor cruel, degrading or inhuman punishment inflicted. Neither shall death penalty be imposed, unless, for compelling reasons involving heinous crimes, the Congress hereafter provides for it. Any death penalty already imposed shall be reduced to reclusion perpetua.' },
      { label: '(2)', body: 'The employment of physical, psychological, or degrading punishment against any prisoner or detainee or the use of substandard or inadequate penal facilities under subhuman conditions shall be dealt with by law.' },
    ],
    plain:
      'Fines cannot be excessive and punishment cannot be cruel, degrading or inhuman. The death penalty is abolished by this clause — but Congress may restore it for heinous crimes if it can give compelling reasons. And prison conditions are themselves a constitutional question, not merely a budget line.',
    why:
      'This is the compromise the 1986 Commission reached after a long and unresolved debate. It did not outlaw capital punishment forever. It switched the default from <em>on</em> to <em>off</em>, commuted every sentence then standing, and placed the burden of any revival squarely on Congress. Paragraph (2) is unusual in comparative constitutional law and reflects the state of Philippine jails.',
    doctrines: [
      { name: 'Abolition with a condition precedent', body: 'Not an absolute prohibition. Revival requires (a) compelling reasons and (b) heinous crimes — two conditions Congress must satisfy together.' },
      { name: 'What "cruel" means', body: 'A punishment that is barbarous, involves torture or a lingering death, or is flagrantly and plainly oppressive. Severity alone is never enough.' },
      { name: 'Proportionality', body: 'A penalty falls only if grossly disproportionate to the offence — not merely because a court would have set it lower.' },
      { name: 'Mode vs. penalty', body: 'The manner of execution can be challenged independently of the penalty itself.' },
      { name: 'Paragraph (2) constitutionalises detention conditions', body: 'Substandard facilities and degrading treatment of detainees are a constitutional violation, and Congress is directed to provide for it by law.' },
    ],
    cases: [
      { name: 'People v. Echegaray', year: '1997', holding: 'Upheld RA 7659, which restored the death penalty for heinous crimes. Whether "compelling reasons" existed was held to be a legislative determination.' },
      { name: 'Echegaray v. Secretary of Justice', year: '1999', holding: 'The Court retains the power to stay execution while it has jurisdiction — a hard-fought line between judicial and executive power at the very last moment of a case.' },
      { name: 'Corpuz v. People', year: '2014', holding: 'Penalties for estafa still keyed to 1932 peso values had become disproportionate, but the remedy was legislative. Congress responded with RA 10951 in 2017.' },
      { name: 'Lim v. People', year: '2000', holding: 'A penalty is not cruel or unusual merely because it is severe. The clause is not a licence to reweigh legislative judgment about punishment.' },
    ],
    real:
      'A person convicted of estafa over ₱200,000 faces a penalty scale written when a peso bought a day\'s labour. Corpuz named the injustice but held that only Congress could correct it — which it eventually did.',
    limits:
      'RA 9346 (2006) now prohibits the imposition of the death penalty entirely, substituting <em>reclusion perpetua</em> without eligibility for parole. Bills to restore it are filed in nearly every Congress; §19 is the clause they must satisfy.',
  },

  /* ────────────────────────────────────────────────────────── XX ─── */
  {
    n: 20,
    title: 'No Imprisonment for Debt',
    short: 'Debt',
    kicker: 'Narrower than it looks — and BP 22 is why',
    text: [
      { label: '', body: 'No person shall be imprisoned for debt or non-payment of a poll tax.' },
    ],
    plain:
      'You cannot be jailed for owing money, or for failing to pay the community tax. But the protection is narrower than most people assume, and several ordinary criminal offences sit right beside it.',
    why:
      'Debtors\' prisons were a real institution, and the poll tax — the <em>cedula</em> — was historically an instrument for controlling the poor and, under Spanish rule, for extracting forced labour from those who could not pay. The clause abolishes both.',
    doctrines: [
      { name: '"Debt" means a contractual obligation', body: 'A civil obligation arising from a contract. The clause does not shield criminal liability that merely happens to involve money.' },
      { name: 'Estafa is not covered', body: 'The crime is the deceit, not the failure to pay. Fraud committed in incurring the obligation takes it outside §20 entirely.' },
      { name: 'BP 22 is constitutional', body: 'The Bouncing Checks Law punishes the <em>act of issuing</em> a worthless check — an offence against public order and confidence in commercial paper — not the underlying debt.' },
      { name: 'Taxes other than the poll tax', body: 'Non-payment of income tax, VAT or customs duties may be criminally punished. Only the poll tax is named.' },
      { name: 'Contempt is not imprisonment for debt', body: 'Jailing someone for defying a court order to pay support enforces a legal obligation and the court\'s authority, not a contract.' },
    ],
    cases: [
      { name: 'Lozano v. Martinez', year: '1986', holding: 'BP 22 does not violate §20. What is punished is the issuance of a check known to be worthless, which injures public confidence in negotiable instruments.' },
      { name: 'Ganaway v. Quillen', year: '1921', holding: 'A person cannot be arrested or detained in a purely civil action for the recovery of a sum of money.' },
      { name: 'Serafin v. Lindayag', year: '1975', holding: 'A judge was administratively sanctioned for issuing a warrant of arrest in what was plainly an ordinary collection case.' },
    ],
    real:
      'A sari-sari store owner is threatened with arrest over an unpaid ₱30,000 <em>utang</em>. The threat is empty. But if she settled that debt with a post-dated check that later bounced, BP 22 changes the picture completely.',
    limits:
      'The protection is genuinely narrow. Estafa, BP 22, tax evasion, indirect contempt and fraud all survive it — which is why most "debt" cases in Philippine courts are prosecuted as something other than debt.',
  },

  /* ───────────────────────────────────────────────────────── XXI ─── */
  {
    n: 21,
    title: 'Double Jeopardy',
    short: 'Double Jeopardy',
    kicker: 'The state gets one attempt',
    text: [
      { label: '', body: 'No person shall be twice put in jeopardy of punishment for the same offense. If an act is punished by a law and an ordinance, conviction or acquittal under either shall constitute a bar to another prosecution for the same act.' },
    ],
    plain:
      'Once you have been acquitted, convicted, or your case dismissed without your consent, the state cannot try you again for the same offence. And if a single act violates both a national law and a local ordinance, the outcome under one blocks prosecution under the other.',
    why:
      'The second sentence is a Philippine addition with no American counterpart. It exists to stop prosecutors from stacking a city ordinance charge on top of a Revised Penal Code charge arising from one and the same act — a tactic that would otherwise let the state have two bites at every apple.',
    doctrines: [
      { name: 'The five requisites', body: 'From Obsania: (1) a valid Information or complaint, (2) filed before a court of competent jurisdiction, (3) after arraignment, (4) a valid plea entered, and (5) the case dismissed or otherwise terminated without the express consent of the accused.' },
      { name: 'Two distinct kinds', body: 'Same <em>offence</em> under the first sentence. Same <em>act</em> under the second — the law-versus-ordinance rule, which is broader.' },
      { name: 'Finality of acquittal', body: 'An acquittal is immediately final and unappealable. The only route around it is certiorari for grave abuse of discretion amounting to a denial of due process — a sham trial, not merely a wrong one.' },
      { name: 'Supervening event doctrine', body: 'If a new fact arises after the first prosecution that changes the character of the offence — the victim later dies of the same injury — a second prosecution is not barred.' },
      { name: 'Dismissals that count as acquittals', body: 'A demurrer to evidence granted, and a dismissal for violation of the right to speedy trial or speedy disposition, both operate as acquittals and bar re-filing.' },
    ],
    cases: [
      { name: 'People v. Obsania', year: '1968', holding: 'Set out the five requisites, and held that a dismissal obtained on the accused\'s own motion is generally with his express consent and so does not bar re-prosecution.' },
      { name: 'Melo v. People', year: '1950', holding: 'The supervening event doctrine. Where the victim dies after a conviction for physical injuries, a homicide prosecution is not barred.' },
      { name: 'People v. Relova', year: '1987', holding: 'A person acquitted of an ordinance violation for tampering with an electric meter could not then be charged under the Revised Penal Code for the same act. The second sentence of §21 controls.' },
      { name: 'Ivler v. Modesto-San Pedro', year: '2010', holding: 'Reckless imprudence is a single quasi-offence, not a mode of committing several crimes. Conviction for the slight physical injuries it caused barred a second prosecution for the homicide from the same collision.' },
    ],
    real:
      'A driver is convicted under a city traffic ordinance after a collision. The prosecutor then files a Revised Penal Code case over the same crash. Under the second sentence of §21, the first conviction bars the second.',
    limits:
      'An appeal by the accused waives the defence in that case. Jeopardy does not attach before arraignment and plea. And a dismissal the accused himself asked for is generally consented to, so it does not bar re-filing — the two exceptions being insufficiency of evidence and denial of the right to speedy trial.',
  },

  /* ──────────────────────────────────────────────────────── XXII ─── */
  {
    n: 22,
    title: 'Ex Post Facto Laws & Bills of Attainder',
    short: 'Ex Post Facto',
    kicker: 'Fair warning, and the ban on legislative convictions',
    text: [
      { label: '', body: 'No ex post facto law or bill of attainder shall be enacted.' },
    ],
    plain:
      'Congress cannot make an act criminal after you have already done it, and it cannot pass a law that simply declares a named person or group guilty without a trial.',
    why:
      'These are the two ways a legislature can bypass the courts entirely — by moving the goalposts backwards, or by convicting people directly from the floor of the chamber. Article III closes both routes in a single sentence.',
    doctrines: [
      { name: 'The six kinds of ex post facto law', body: 'A law that (1) makes criminal an act innocent when done; (2) aggravates a crime after commission; (3) inflicts a greater punishment than the law annexed to the crime when committed; (4) alters the rules of evidence to require less proof for conviction; (5) regulates civil rights and remedies but in effect imposes a penalty for an act lawful when done; or (6) deprives a person of a protection to which he had become entitled, such as an amnesty or a prior acquittal.' },
      { name: 'Penal laws only', body: 'The prohibition reaches penal laws operating retroactively to the prejudice of the accused. A civil statute given retroactive effect is tested under due process, not §22.' },
      { name: 'Favourable retroactivity is required', body: 'A law that <em>lowers</em> a penalty is not merely permitted to apply retroactively — under Article 22 of the Revised Penal Code it must, unless the accused is a habitual criminal.' },
      { name: 'Bill of attainder', body: 'A legislative act inflicting punishment on named individuals or an easily ascertainable group <em>without judicial trial</em>. Its vice is the substitution of legislative fiat for judicial determination of guilt.' },
      { name: 'Procedure vs. substance', body: 'Purely procedural changes — venue, jurisdiction, the mechanics of trial — are not ex post facto. Changes that revive an already-prescribed offence are.' },
    ],
    cases: [
      { name: 'In re Kay Villegas Kami', year: '1970', holding: 'The canonical enumeration of the six kinds of ex post facto law, still quoted in every subsequent case.' },
      { name: 'People v. Ferrer', year: '1972', holding: 'The Anti-Subversion Act was held not to be a bill of attainder, because conviction still required judicial proof of knowing membership and overt acts — the trial had not been dispensed with.' },
      { name: 'Lacson v. Executive Secretary', year: '1999', holding: 'RA 8249, expanding Sandiganbayan jurisdiction, was procedural and could apply to pending cases without being ex post facto.' },
      { name: 'Bayot v. Sandiganbayan', year: '1984', holding: 'A law making suspension <em>pendente lite</em> mandatory could not be applied to acts committed before its passage.' },
    ],
    real:
      'A new statute raises the penalty for an offence committed last year. It cannot reach that act. If instead it lowers the penalty, it must be applied — retroactivity that favours the accused is not optional.',
    limits:
      'The clause binds Congress, not the courts. A judicial reinterpretation of an existing statute that worsens a defendant\'s position is not an ex post facto law, though it may still be attacked on due process grounds.',
  },
];

const ROMAN = [
  '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
  'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII',
];

export const SECTIONS = RAW.map((s, i) => ({
  ...s,
  index: i,
  roman: ROMAN[s.n],
  cluster: CLUSTER_OF[s.n],
  /** flat searchable haystack */
  search: [
    `Section ${s.n}`, s.title, s.short, s.kicker,
    ...s.text.map((t) => t.body),
    s.plain, s.why, s.real, s.limits,
    ...s.doctrines.flatMap((d) => [d.name, d.body]),
    ...s.cases.flatMap((c) => [c.name, c.holding]),
  ].join(' ').replace(/<[^>]+>/g, '').toLowerCase(),
}));

export const SECTION_COUNT = SECTIONS.length;
