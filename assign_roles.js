async function assignRoles(member) {
    const MANAGED_ROLES = ["Supervisor", "Administrator", "New Member", "PPL", "IR", "CMEL", "ATPL"];
    const discordCidResponse = await fetch(`https://apiv2-dev.vatsim.net/v2/members/discord/${member.user.id}`);
    let discordCidBody = await discordCidResponse.json();
    let cid = discordCidBody.user_id;
    if (discordCidBody.detail === 'Not Found') {
        return;
    }
    const ratingsResponse = await fetch(`https://api.vatsim.net/api/ratings/${cid}`);
    const ratingsBody = await ratingsResponse.json();
    let rating = ratingsBody.rating;
    let pilotrating = ratingsBody.pilotrating;
    let roles = [];

    if (rating === 11) {  //SUP
        roles.push("Supervisor");
    } else if (rating === 12) {  //ADM
        roles.push("Administrator");
    }
    if (pilotrating === 0) {
        roles.push("New Member");
    } else if (pilotrating === 1) {
        roles.push("PPL");
    } else if (pilotrating === 3) {
        roles.push("IR");
    } else if (pilotrating === 7) {
        roles.push("CMEL");
    } else if (pilotrating === 15) {
        roles.push("ATPL");
    }
    for (const role of MANAGED_ROLES) {
        const discordRole = member.guild.roles.cache.find(r => r.name === role);
        if (roles.includes(role)) {
            if (!member.roles.cache.some(r => r.name === role)) {
                member.roles.add(discordRole).catch(e => console.log(e));
            }
        } else {
            if (member.roles.cache.some(r => r.name === role)) {
                member.roles.remove(discordRole).catch(e => console.log(e));
            }
        }
    }
    console.log(`Done Assigning Roles to ${member.user.id} , ${cid} - ${roles.join(", ")}`);
    return roles.join(", ");
}

module.exports = {
    assignRoles: assignRoles
}