let arrMailboxes = [ 'INBOX',
'INBOX.ALEXANDR MARTS',
'INBOX.Mailchimp',
'INBOX.CCAvenue',
'INBOX.EMIRATES ISLAMIC',
'INBOX.BEONTOP',
'INBOX.SOCIAL NETWORKS',
'INBOX.DMCC',
'INBOX.NEWSLETTERS',
'INBOX.HHKZ',
'INBOX.spam',
'INBOX.Garant Corporate Mailing' ]
function chunkify(a, n, balanced) {

    if (n < 2)
      return [a];

    var len = a.length,
      out = [],
      i = 0,
      size;

    if (len % n === 0) {
      size = Math.floor(len / n);
      while (i < len) {
        out.push(a.slice(i, i += size));
      }
    }

    else if (balanced) {
      while (i < len) {
        size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i += size));
      }
    }

    else {

      n--;
      size = Math.floor(len / n);
      if (len % size === 0)
        size--;
      while (i < size * n) {
        out.push(a.slice(i, i += size));
      }
      out.push(a.slice(size * n));

    }

    return out;
  }
  let chunked = chunkify(arrMailboxes, 4, true)
  console.log(chunked)