#NoTrayIcon

SetBatchLines -1
SetKeyDelay, -1
SendMode Input

stdin  := FileOpen("*", "r `n")

while (key := RTrim(stdin.ReadLine(), "`n")) {
  if (key) {
    Send, % key
  }
}